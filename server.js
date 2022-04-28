const express = require('express');
const { PORT } = require('./config/config');
const passportSetup = require('./config/passport-setup');
const connectDB = require("./config/db")
const app = express();
const cors = require('cors');
const passport = require('passport');
connectDB();

const corsOpts = {
    origin: '*',

    methods: [
        'GET',
        'POST',
    ],

    allowedHeaders: [
        '*',
    ],
};

app.use(cors(corsOpts));

app.use(passport.initialize());

//init middleware 
app.use(express.json({ extended: true }))

app.get("/", (req, res) => {
    res.send("Api running")
})

app.use("/api/v1/users", require("./routes/api/users"));
app.use("/api/v1/auth", require("./routes/api/auth"));
app.use("/api/v1/profile", require("./routes/api/profile"));
app.listen(PORT, () => console.log(`server started on port ${PORT}`));
