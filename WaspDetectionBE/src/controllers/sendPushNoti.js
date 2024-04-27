
exports.sendPushNoti = (req, res) => {

    console.log(req.body)
    console.log(req.body.beeInfo['boxes'])
    console.log(req.body.beeInfo['boxes'])
    return res.json({message: "success"})
};


