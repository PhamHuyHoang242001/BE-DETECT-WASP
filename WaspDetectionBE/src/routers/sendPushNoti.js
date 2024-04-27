const express = require("express");
const router = express.Router();
const {

    sendPushNoti
} = require("../controllers/sendPushNoti.js");


router.post("/sendpush", sendPushNoti);


module.exports = router;
