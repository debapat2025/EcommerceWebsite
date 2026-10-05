const mongoose = require("mongoose");
const logger = require('../utils/logger');

const env = require('./env');
const connectToDb = async()=>{
    try{
   await mongoose.connect(env.MONGO_URI);
  // console.log("mongodb is connected successfully")
  logger.info('mongodb is connected successfully')
    }
    catch(error){
      console.error("mongodb connection fail",error)
      process.exit(1)
    }
}

module.exports =connectToDb;