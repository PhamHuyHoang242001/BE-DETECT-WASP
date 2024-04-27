
const Farm = require("../models/farm")

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
    farm.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ data });
    });
};
exports.read = (req, res) => {
    return res.json(req.farm);
};
exports.list = (req, res) => {
    Farm.find({ownerID: {$eq: req.params.ownerID}}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};
exports.update = (req, res) => {
    const farm = req.farm;
    farm.name = req.body.name;
    farm.ownerID = req.body.ownerID
    farm.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};
exports.remove = (req, res) => {
    const farm = req.farm;
    farm.remove((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({ message: "farm deleted" });
    });
};

