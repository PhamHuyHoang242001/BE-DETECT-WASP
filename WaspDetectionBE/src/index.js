//require
const express = require("express");
const mongoose = require("mongoose");

const camDeviceRoute =  require("./routers/camDevice")
const authRoute =  require("./routers/auth")
const userRoute =  require("./routers/user")
const imageRoute =  require("./routers/image")
const farmRoute =  require("./routers/farm")
const sendPushNotiRoute =  require("./routers/sendPushNoti")
require("dotenv").config();


const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
//import route
//app
const app = express();
const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
  } = process.env;
mongoose
    .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
        useNewUrlParser: true,
        authSource: "admin",
        user: DB_USER,
        pass: DB_PASSWORD,
      })
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(DB_HOST,DB_NAME,DB_PORT,DB_USER)
        console.log(err);
    });
//middlewares
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use(bodyParser.json());

//route

app.use("/api/v1", camDeviceRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", imageRoute);

app.use("/api/v1", farmRoute);
app.use("/api/v1", sendPushNotiRoute);

const port = process.env.NODE_LOCAL_PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
