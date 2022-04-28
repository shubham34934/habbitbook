const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    "CLIENT_APP_URL": "http://localhost:3000",
    "APP_URL": "http://localhost:9000",
    "DATABASE_USER_NAME": process.env.DATABASE_USER_NAME,
    "DATABASE_PASSWORD": process.env.DATABASE_PASSWORD,
    "DATABASE_NAME": process.env.DATABASE_NAME,
    "PORT": process.env.PORT || 9000,
    "NODE_ENV": process.env.NODE_ENV,
    "JWT_SECRET": "habbitbook",
    "GOOGLE_CLIENT_ID": "238543917305-asmoihj7rjqvov5gr24ud2js4jqi1ka9.apps.googleusercontent.com",
    "GOOGLE_CLIENT_SECRET": "c8mYJJVJ9zd7ZQ-bLfLk0Zlx"

};