const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const camDeviceSchema = new mongoose.Schema(
    {
        farmID:{
            type: ObjectId,
            ref: "Farm",
        },
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        },delayTime:{
            type: Number,
            required: true,
        },resolution:{
            type: Number,
            trim: true,
            required: true,
            maxlength: 32,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("CamDevice", camDeviceSchema);
