const mongoose = require("mongoose");
const dns = require("dns");

// Use reliable DNS servers for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dbconnection = async () => {
    try {
        console.log("Connecting to MongoDB Atlas Database...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 15000,
        });

        console.log("Connected to MongoDB Atlas successfully!");
    } catch (error) {
        console.error("MongoDB Atlas Connection Failed:");
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = dbconnection;