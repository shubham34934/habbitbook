const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        required: false
    }
})

const Profile = mongoose.model("profile", ProfileSchema);

module.exports = Profile;