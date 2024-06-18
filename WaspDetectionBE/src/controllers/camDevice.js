
const CamDevice = require("../models/camDevice")
const Farm = require("../models/farm")
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
    for(const x in req.body){
        
        camDevice[x] = req.body[x]
        if(req.body[x] === null) camDevice[x] = undefined
    }
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
        let queryStatus = {}
        console.log(req.query.status)
        if(req.query.status == "all" || !req.query.status) queryStatus = {}
        else if(req.query.status == "sold") queryStatus = {userID: {$ne: null}}
        else if(req.query.status == "available") queryStatus = {userID: {$exists: false}}
        const query = req.query.searchText ? { "name": { $regex: req.query.searchText, $options: 'i' } } : {};
        const queryParam = {$and:[queryStatus,query]}
        console.log(queryStatus,queryParam)
        const allCamDevice = await CamDevice.countDocuments(queryParam);
        let data = {};
        data.count = allCamDevice;
        data.num_pages = Math.ceil(allCamDevice / pagesize);
        data.page = page;
        data.page_size = pagesize;
        const camDevices = await CamDevice.find(queryParam).sort([[sortBy, order]]).skip(skip)
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
exports.listCamDeviceNotUsed = async (req, res) => {
    try {
        console.log(req.params.userID)
        const list = await CamDevice.find({ $and: [{ userID: req.params.userID }, { farmID: {$exists: false} }] }).select("_id name")
        console.log(list)
        const results = list.map((item)=>{ return {value: item._id,label: item.name}})
        return res.json(results)

    }
    catch (err) {
        return res.status(400).json({ err: err })
    }

}
exports.changeNumberDeviceInsert = async (req, res, next) => {
    try {
        console.log(req.body.farmID)
        if (req.body.farmID) {
            const farm = await Farm.findById(req.body.farmID)
            if (farm) farm.numberDevices += 1
            await farm.save()

        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error:
                "error"
        })
    }
    next()


}
exports.changeNumberDevice = async (req, res, next) => {
    try {
        if(req.body.farmID === null){
            const oldFarm = await Farm.findById(req.camDevice.farmID)
            console.log(oldFarm)
            if (oldFarm) {
                oldFarm.numberDevices -= 1
                await oldFarm.save()
            }
        }
        else if(req.body.farmID && req.body.farmID != req.camDevice.farmID){
            const oldFarm = await Farm.findById(req.camDevice.farmID)
            console.log(oldFarm)
            if (oldFarm) {
                oldFarm.numberDevices -= 1
                await oldFarm.save()
            }
            const newFarm = await Farm.findById(req.body.farmID);
            if (newFarm) {
                newFarm.numberDevices += 1
                await newFarm.save()
            }
        }

    } catch (err) {
        console.log(err)
        return res.status(400).json({
            error:
                "error"
        })
    }
    next()

}
