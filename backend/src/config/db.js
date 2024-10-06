const mongoose = require("mongoose");

// const url = Config.DB_URL;

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database Connected successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = dbConnection;
