const mongoose = require('mongoose');
const config = require('config');
const { DATABASE_USER_NAME, DATABASE_PASSWORD, DATABASE_NAME } = require('./config');

const mongoURI = `mongodb://${DATABASE_USER_NAME}:${DATABASE_PASSWORD}@habbitbook-shard-00-00.jl0qa.mongodb.net:27017,habbitbook-shard-00-01.jl0qa.mongodb.net:27017,habbitbook-shard-00-02.jl0qa.mongodb.net:27017/${DATABASE_NAME}?ssl=true&replicaSet=atlas-d8tq64-shard-0&authSource=admin&retryWrites=true&w=majority`;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log("Mongodb connected");
    }
    catch (error) {
        console.log(error.message);
        //exit process on failure 
        process.exit(1);
    }
}

module.exports = connectDB;