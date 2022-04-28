const express = require('express');
const router = express.Router();
const auth = require("./../../middleware/auth")
const User = require("./../../models/user")
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, CLIENT_APP_URL } = require('../../config/config.js');
const passport = require('passport');
const bcrypt = require('bcryptjs');

//@route GET api/v1/auth
//@access Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    }
    catch (err) {
        res.status(500).send("server error")
    }
})

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get('/google/redirect',
    passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
    function (req, res) {
        const user = req.user;
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            console.log(token)
            res.redirect(`${CLIENT_APP_URL}/?token=${token}`);
        })
    });


router.post("/updatePassword", [check("email", "Invalid email format").isEmail(), check("newPassword", "Password must be of minimum 6 characters").isLength({ min: 6 }), check("password", "Password is required").exists()]
    , async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ errors: errors.array() })

        }

        const { newPassword, password, email } = req.body;

        try {

            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ message: "Invalid Credentials" }] })
            }

            const isMatch = await bcrypt.compare(password, user.password);
            const isSame = await bcrypt.compare(newPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ errors: [{ message: "Invalid Credentials" }] })
            }
            if (isSame) {
                return res.status(400).json({ errors: [{ message: "New password can not be same as previous one" }] })
            }

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(newPassword, salt);

            await user.save();

            return res.status(200).json({ message: "Password updated successfully" })

        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    })



router.post("/", [check("email", "Invalid email format").isEmail(), check("password", "Password is required").exists()]
    , async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).json({ errors: errors.array() })

        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: [{ message: "Invalid Credentials" }] })
            }
            console.log("user 1")

            const isMatch = await bcrypt.compare(password, user.password || "");
            console.log("user 2")

            if (!isMatch) {
                return res.status(400).json({ errors: [{ message: "Invalid Credentials" }] })
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            console.log(payload)
            jwt.sign(payload, JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })
        }
        catch (error) {
            res.status(500).json({ error: error.message })
        }
    })


module.exports = router