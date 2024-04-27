
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
    camDevice.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ data });
    });
};
exports.read = (req, res) => {
    return res.json(req.camDevice);
};
exports.update = (req, res) => {
    const camDevice = req.camDevice;
    camDevice.name = req.body.name;
    camDevice.farmID = req.body.farmID;
    camDevice.resolution = req.body.resolution;
    camDevice.delayTime = req.body.delayTime;
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
exports.list = (req, res) => {
    console.log(req.params.farmID)
    CamDevice.find({farmID: {$eq: req.params.farmID}}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};
