const express = require("express");
const router = express.Router();
const {
    create,
    camDeviceById,
    read,
    update,
    remove,
    listByFarm,
    listSearch,
    changeNumberDevice,
} = require("../controllers/camDevice.js");



router.post("/camdevice", changeNumberDeviceInsert, create);
router.get("/camdevice/:camDeviceId", read);
router.put(
    "/camdevice/:camDeviceId", changeNumberDevice,
    update
);
router.delete(
    "/camdevice/:camDeviceId",
    remove
);
router.get("/camdevice/farm/:farmID", listByFarm);
router.get("/camdevice", listSearch);
router.param("camDeviceId", camDeviceById);

module.exports = router;
