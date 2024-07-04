const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connect = () => {
  mongoose.connect(process.env.mongo_url).then(() => {
    console.log("Database connected successfully !!!");
  });
};

module.exports = {
  connect,
};
