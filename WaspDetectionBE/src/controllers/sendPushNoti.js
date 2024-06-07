var admin = require("firebase-admin");
const CamDevice = require("../models/camDevice")
const User = require("../models/user");
var serviceAccount = require("../../wasp-detection-firebase-adminsdk-5f3qd-6ef2f878b7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
exports.sendPushNoti = async (req, res) => {

    let data = req.body
    console.log(data)
    const device = await CamDevice.findById(data.deviceID).populate('farmID')
    const user = await User.findById(device.farmID.ownerID)
    console.log(device)
    let beeInfo = data.beeInfo
    console.log(beeInfo)
    let beeDensity = 0;
    for (let i = 0; i < beeInfo.length; i++) {
        beeDensity += beeInfo[i]["bee_count"]
    }
    
    beeDensity = beeDensity / beeInfo.length
    console.log(beeDensity)
    if(beeDensity < 0.25) return res.json({ message: "success" })
    data.beeDensity = beeDensity.toFixed(2)
    let timestamp = new Date()
    data.timestamp = timestamp.toISOString().slice(0,19)
    data.timestamp =JSON.stringify(data.timestamp)
    data.beeInfo = JSON.stringify(data.beeInfo)
    console.log(data)
    let regis_tokens = user.fcm_token
    const messaging = admin.messaging()
    var payload = {

        data: data,
        token: regis_tokens
    };

    messaging.send(payload)
        .then((result) => {
            console.log(result)
        })
    return res.json({ message: "success" })
};


