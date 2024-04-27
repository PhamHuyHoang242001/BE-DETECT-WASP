const express = require("express");
const router = express.Router();
const {
    create,
    farmById,
    read,
    update,
    remove,
    list,
} = require("../controllers/farm.js");



router.post("/farm", create);
router.get("/farm/:farmId", read);
router.put(
    "/farm/:farmId",
    update
);
router.delete(
    "/farm/:farmId",
    remove
);
router.get("/farm/user/:ownerID", list);
router.param("farmId", farmById);

module.exports = router;
