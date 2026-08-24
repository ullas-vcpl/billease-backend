const mongooseq = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const getDatabase = async (databaseName) => {
  try {
    return await mongoose.connection.useDb(databaseName);
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
    }
};

module.exports = getDatabase;