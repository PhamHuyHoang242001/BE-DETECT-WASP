const express = require("express");
const router = express.Router();
const {
    create,
    camDeviceById,
    read,
    update,
    remove,
    list,
} = require("../controllers/camDevice.js");



router.post("/camdevice", create);
router.get("/camdevice/:camDeviceId", read);
router.put(
    "/camdevice/:camDeviceId",
    update
);
router.delete(
    "/camdevice/:camDeviceId",
    remove
);
router.get("/camdevice/farm/:farmID", list);

router.param("camDeviceId", camDeviceById);

module.exports = router;
