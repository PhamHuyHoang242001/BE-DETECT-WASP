const Image = require("../models/image");
const CamDevice = require("../models/camDevice");
const formidable = require("formidable");
const _ = require("lodash");
const path = require("path");
const { errorHandler } = require("../helpers/dbErrorHandle");
const fs = require("fs");
const axios = require("axios")

exports.imageById = (req, res, next, id) => {
  Image.findById(id).exec((err, camDevice) => {
    if (err || !camDevice) {
      return res.status(400).json({
        error: "Image not found",
      });
    }
    req.image = image;
    next();
  });
};
exports.create = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  const start_all = Date.now();
  
  let camDevice = {};

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    try {
      camDevice = await CamDevice.findById(fields.deviceID).exec();
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Cam Device not found",
      });
    }
    let image = new Image(fields);
    image.uploadTime = new Date();
    let newImageName = "";
    try {
      const newImage = await image.save();
      newImageName = newImage._id;
      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: "File image should be less than 10mb in size",
          });
        }

        console.log(newImageName);
        let newPath =
          path.join(__dirname, "..", "..", "uploads") +
          "/" +
          newImageName +
          ".jpg";
        const start_rw_file = Date.now();
        let rawData = fs.readFileSync(files.photo.filepath);

        fs.writeFileSync(newPath, rawData);
        // file written successfully
        const start_predict = Date.now();
        let data_predict = await axios.get(`http://yolov8-service:3333/predict?filename=${newImageName}.jpg`)
        const end = Date.now();
        console.log("total time",end-start_all)
        console.log("write file time",start_predict -start_rw_file)
        console.log("predict time",end -start_predict)
        data_predict.data['imageID'] = newImageName
        console.log(data_predict.data)
        return res.json(data_predict.data)
        fs.writeFile(newPath, rawData, function (err) {
          if (err) console.log(err);
          return res.json(camDevice);
        });

      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: "Error when uploading",
      });
    }
  });
};
exports.read = (req, res) => {
  return res.json(req.image);
};
exports.photo = (req, res) => {
  console.log(req.params.photoId);
  const imagePath =
    path.join(__dirname,"..","..", "uploads") + "/" + req.params.photoId + ".jpg";

  let rawData = fs.readFileSync(imagePath);
  res.set("Content-Type", "image/jpeg");
  return res.send(rawData);
};
exports.list = (req, res) => {
  console.log(req.query.fromTime);
  let fromTime = req.query.fromTime ? new Date(req.query.fromTime) : 0;
  let toTime = req.query.toTime ? new Date(req.query.toTime) : new Date();
  Image.find({
    createdAt: { $lte: toTime, $gte: fromTime },
    deviceID: { $eq: req.camDevice._id },
  }).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
