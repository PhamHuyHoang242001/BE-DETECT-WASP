const express = require("express");
const router = express.Router();
const {
    userById,
    read,
    update,
} = require("../controllers/user.js");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth.js");
router.get("/secret/:userId", requireSignin, isAuth, isAdmin, (req, res) => {
    res.json({
        user: req.profile,
    });
});

router.get("/user/:userId", requireSignin, isAuth, read);
router.put("/user/:userId", update);
router.param("userId", userById);

module.exports = router;
