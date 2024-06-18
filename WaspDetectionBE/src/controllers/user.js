const User = require("../models/user");
const Farm = require("../models/farm");
const CamDevice = require("../models/camDevice");
const { errorHandler } = require("../helpers/dbErrorHandle")
exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User not found",
            });
        }
        req.profile = user;
        next();
    });
};
exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};
exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        req.body,
        { new: true },
        (err, user) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    error: "You are not authorized",
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    );
};
exports.remove = async (req, res) => {
    const user = req.profile;
    try {
        const allFarm = await Farm.find({ ownerID: user._id });
        console.log(allFarm);
        for (const item of allFarm) {
            await CamDevice.deleteMany({ farmID: { $eq: item._id } })
        }
        await Farm.deleteMany({ownerID: user._id })
        await user.remove();
        return res.json({message: "User deleted"})

    }
    catch (err) {
        return res.status(400).json({
            error: errorHandler(err),
        });
    }
};
exports.listSearch = async (req, res) => {
    //create query object to hold search value and category value
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "name";
    let pagesize = req.query.pagesize ? parseInt(req.query.pagesize) : 10;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let skip = (page - 1) * pagesize
    try {

        const query = req.query.searchText ? { $or: [{ "name": { $regex: req.query.searchText, $options: 'i' } }, { "phone": { $regex: req.query.searchText, $options: 'i' } }, { "address": { $regex: req.query.searchText, $options: 'i' } }] } : {};

        const allUser = await User.countDocuments(query);
        let data = {};
        data.count = allUser;
        data.num_pages = Math.ceil(allUser / pagesize);
        data.page = page;
        data.page_size = pagesize;
        const users = await User.find(query).select("-salt -hashed_password").sort([[sortBy, order]]).skip(skip)
            .limit(pagesize)
        data.results = users
        return res.json(data)

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            error: "User not found",
        });
    }
};


