
//thi is for mobile hospot connection issues.
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

// new server,js code with app.js
const env = require('./config/env');      // load env first
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Bugs in synchronous code
process.on('uncaughtException', (err) => {
  logger.error(`UNCAUGHT EXCEPTION: ${err.stack}`);
  process.exit(1);
});

let server;

connectDB().then(() => {
  server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
});

// Unhandled promise errors (for example, DB connection failure)
process.on('unhandledRejection', (err) => {
  logger.error(`UNHANDLED REJECTION: ${err.stack || err}`);
  if (server) server.close(() => process.exit(1));
  else process.exit(1);
});





//single server.js code

// require("dotenv").config();
// const config = require('./config/env');



// const express = require("express");
// const PORT = config.PORT || 3000;
// const HOST = config.HOST || "localhost";


// const connectToDb = require('./config/db')
// const app = express();

// //connect to db
// connectToDb();


// //middleware
// app.use(express.json());

// app.get("/",(req,res)=>{
//     res.send("<h1>Welcome to ecoomerce API</h1>");
// })

// //lisson port
// app.listen(PORT, HOST, () => {
//     console.log(`Server  running on http://${HOST}:${PORT}`);
// })




