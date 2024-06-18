
const Farm = require("../models/farm")
const { errorHandler } = require("../helpers/dbErrorHandle");
const CamDevice = require("../models/camDevice");
exports.farmById = (req, res, next, id) => {
    Farm.findById(id).exec((err, camDevice) => {
        if (err || !camDevice) {
            return res.status(400).json({
                error: "Farm not exist",
            });
        }
        req.farm = camDevice;
        next();
    });
};
exports.create = (req, res) => {

    const farm = new Farm(req.body);
    farm.save((err, farm) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(farm);
    });
};
exports.read = (req, res) => {
    return res.json(req.farm);
};
exports.list = async (req, res) => {
    try {
        let farmByUser = await Farm.find({ ownerID: { $eq: req.params.ownerID } })
        
        return res.json(farmByUser)
    } catch (err) {
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
        const query = req.query.searchText ? { "name": { $regex: req.query.searchText, $options: 'i' } } : {};

        const allFarm = await Farm.countDocuments(query);
        let data = {};
        data.count = allFarm;
        data.num_pages = Math.ceil(allFarm / pagesize);
        data.page = page;
        data.page_size = pagesize;
        const farms = await Farm.find(query).sort([[sortBy, order]]).skip(skip)
            .limit(pagesize)
        data.results = farms
        return res.json(data)

    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            error: "Farm not found",
        });
    }
};

exports.update = (req, res) => {
    const farm = req.farm;
    farm.name = req.body.name ? req.body.name : farm.name;
    farm.ownerID = req.body.ownerID ? req.body.ownerID : farm.ownerID
    farm.numberDevices = req.body.numberDevices ? req.body.numberDevices : farm.numberDevices
    farm.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};
exports.remove = async(req, res) => {
    const farm = req.farm;
    const listDevice = await CamDevice.find({farmID: farm._id})
    for(const item of listDevice){
        item.farmID = undefined
        await item.save();
    }
    farm.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "farm deleted" });
    });
};

