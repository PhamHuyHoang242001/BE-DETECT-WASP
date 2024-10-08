const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
        },
        hashed_password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        address: {
            type: String,
            trim: true,
        },
        fcm_token: String,
        salt: String,
        role: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

//virtual field
userSchema
    .virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this.password;
    });

userSchema.methods = {
    authenticate: function (plaintText) {
        return this.encryptPassword(plaintText) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto
                .createHmac("sha1", this.salt)
                .update(password)
                .digest("hex");
        } catch (err) {
            return "";
        }
    },
};

module.exports = mongoose.model("User", userSchema);
