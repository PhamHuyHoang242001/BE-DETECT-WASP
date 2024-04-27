const express = require("express");
const router = express.Router();
const {
    create,
    imageById,
    read,
    list,
    photo
} = require("../controllers/image.js");

const {
    camDeviceById,
} = require("../controllers/camDevice.js");

router.post("/image", create);
router.get("/image/:camDeviceId/:imageId", read);
router.get("/image/:camDeviceId", list);
router.get("/photo/:photoId",photo)
router.param("imageId", imageById);
router.param("camDeviceId", camDeviceById);

module.exports = router;
