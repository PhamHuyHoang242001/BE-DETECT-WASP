const User = require("../models/user");
exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Name is reqired').notEmpty()
    req.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4,
            max: 32
        })
    req.check('password', 'Password is reqired').notEmpty()
    req.check('phone').isLength({ min: 10, max: 10 })
        .withMessage("Phone must contain 10 characters").matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/).withMessage("Phone number must be right format").custom(value => {
            return User.findOne({ where: { phone: value } })
                .then(() => {
                    return Promise.reject('Phone already taken')
                })
        }),
        req.check('password')
            .isLength({ min: 6 })
            .withMessage("Password must contain at least 6 characters")
            .matches(/\d/)
            .withMessage("Password must contain a number")
    const errors = req.validationErrors()
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }
    next()
}
exports.userUpdateValidator = (req, res, next) => {
    req.check('phone', 'Cannot change phone number').isEmpty()
    const errors = req.validationErrors()
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }
    next()

}