const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const farmSchema = new mongoose.Schema(
    {
        ownerID: {
            type: ObjectId,
            ref: "User",
        },
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Farm", farmSchema);
