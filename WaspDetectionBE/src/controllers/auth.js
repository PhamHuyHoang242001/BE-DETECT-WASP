const User = require("../models/user");
const jwt = require("jsonwebtoken"); // generate signed token
const { expressjwt } = require("express-jwt"); //authorization check
const {errorHandler} = require("../helpers/dbErrorHandle")
require("dotenv").config();
exports.signup = (req, res) => {
    console.log("req.body", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user,
        });
    });
};
exports.signin = (req, res) => {
    // fin the user baserd on email
    const { phone, password, fcm_token } = req.body;
    User.findOne({ phone }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that phone number does not exist. Please signup",
            });
        }
        //if user is found make sure the email and password match
        //create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "phone number and password dont match",
            });
        }
        //generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        user.fcm_token = fcm_token
        const { _id, name, email, role, phone, address } = user;
        console.log(user);
        user.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
        })
        //return response with user and token to frontend client
        return res.json({
            token,
            user: { _id, email, name, role, phone, address },
        });
    });
};
exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "Signout success" });
};
exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access denied",
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Admin resourse! Access denied",
        });
    }
    next();
};
