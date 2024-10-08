const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const camDeviceSchema = new mongoose.Schema(
    {
        farmID: {
            type: ObjectId,
            ref: "Farm",
        },
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        }, delayTime: {
            type: Number,
            required: true,
        }, resolution: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32,
        }, userID: {
            type: ObjectId,
            ref: "User",
        }
    },
    { timestamps: true, toJSON: { virtuals: true } }
);
camDeviceSchema.virtual("status").get(function () {
    if(this.userID)return true;
    return false
});
module.exports = mongoose.model("CamDevice", camDeviceSchema);
