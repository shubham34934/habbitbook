const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config.js');
const User = require("./../models/user")

module.exports = async (req, res, next) => {

    // get token from header
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no Token " })
    }

    //verify token 
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.user;
        const user = await User.findById(decoded.user.id);
        if (!user) {
            res.status(401).json({ message: "Unauthorized" })
        }
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized, Token is not valid" })
    }
}