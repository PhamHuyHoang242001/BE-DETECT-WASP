
const CamDevice = require("../models/camDevice")

exports.camDeviceById = (req, res, next, id) => {
    CamDevice.findById(id).exec((err, camDevice) => {
        if (err || !camDevice) {
            return res.status(400).json({
                error: "camDevice not exist",
            });
        }
        req.camDevice = camDevice;
        next();
    });
};
exports.create = (req, res) => {
    console.log(req.body);
    const camDevice = new CamDevice(req.body);
    camDevice.save((err, camDevice) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(camDevice);
    });
};
exports.read = (req, res) => {
    return res.json(req.camDevice);
};
exports.update = (req, res) => {
    const camDevice = req.camDevice;
    camDevice.name = req.body.name ? req.body.name : camDevice.name;
    camDevice.farmID = req.body.farmID ? req.body.farmID : camDevice.farmID;
    camDevice.resolution = req.body.resolution ? req.body.resolution : camDevice.resolution;
    camDevice.delayTime = req.body.delayTime ? req.body.delayTime : camDevice.delayTime;
    camDevice.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};
exports.remove = (req, res) => {
    const camDevice = req.camDevice;
    camDevice.name = req.body.name;
    camDevice.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "camDevice deleted" });
    });
};
exports.listByFarm = (req, res) => {
    console.log(req.params.farmID)
    CamDevice.find({ farmID: { $eq: req.params.farmID } }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
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

        const allCamDevice = await CamDevice.countDocuments(query);
        let data = {};
        data.count = allCamDevice;
        data.num_pages = Math.ceil(allCamDevice / pagesize);
        data.page = page;
        data.page_size = pagesize;
        const camDevices = await CamDevice.find(query).sort([[sortBy, order]]).skip(skip)
            .limit(pagesize)
        data.results = camDevices
        return res.json(data)
        
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            error: "Cam Device not found",
        });
    }
};
