const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const imageSchema = new mongoose.Schema(
    {
        deviceID: {
            type: ObjectId,
            ref: "CamDevice",
        }, uploadTime:{
            type: Date,
            require: true

        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Image", imageSchema);
