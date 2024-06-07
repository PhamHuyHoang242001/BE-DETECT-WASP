const express = require("express");
const router = express.Router();
const { userUpdateValidator} = require('../validator')
const {
    userById,
    read,
    update,
    listSearch,
    remove
} = require("../controllers/user.js");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth.js");
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", update);
router.get("/user", listSearch);
router.param("userId", userById);
router.delete(
    "/user/:userId",
    remove
);
module.exports = router;
