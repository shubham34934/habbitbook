const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const auth = require("./../../middleware/auth")
const Profile = require("./../../models/profile");
const User = require("./../../models/user");

router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar", "email"]);
        if (!profile) {
            res.status(400).json({ errors: [{ message: "There is no profile for this user" }] })
        }
        else
            res.json(profile)
    }
    catch (err) {
        res.status(500).send("Server Error")
    }
})


router.post("/", auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { status, name, avatar } = req.body;
        const profileObj = {};
        profileObj.user = req.user.id;
        if (status)
            profileObj.status = status;
        try {
            let profile = await Profile.findOne({ user: req.user.id });
            console.log("updating", profile)
            if (profile) {
                const query = { user: req.user.id };
                // Set some fields in that document
                const update = {
                    $set: profileObj
                };
                // Return the updated document instead of the original document
                const options = { new: true, useFindAndModify: false };
                const updatedProfile = await Profile.findOneAndUpdate(query, update, options);

                const userUpdateObj = {};
                if (name)
                    userUpdateObj.name = name;
                if (avatar)
                    userUpdateObj.avatar = avatar;
                const newUser = await User.findOneAndUpdate({ id: updatedProfile.user }, { $set: userUpdateObj }, { useFindAndModify: false, new: true });
                console.log(newUser)
                res.json(updatedProfile)
            } else {
                profile = new Profile(profileObj);
                await profile.save();
                res.json(profile)
            }
        }
        catch (err) {
            res.status(500).send("Server Error")
        }
    })



module.exports = router