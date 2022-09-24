// const { Sequelize } = require("sequelize");

// // // Option 1: Passing a connection URI
// // const sequelize = new Sequelize("sqlite::memory:"); // Example for sqlite
// // const sequelize = new Sequelize("postgres://user:pass@example.com:5432/dbname"); // Example for postgres

// // // Option 2: Passing parameters separately (sqlite)
// // const sequelize = new Sequelize({
// //   dialect: "mysql",
// //   storage: "path/to/database.sqlite",
// // });
// // "username": "ezuchkfijelmvc",
// // "password": "29b557dbc933edf7a1934494f17b001c6aadfdb24409d639c20962682ef090ea",
// // "database": " d8d7dvin3ag32o",
// // "host": "ec2-44-197-128-108.compute-1.amazonaws.com",
// // Option 3: Passing parameters separately (other dialects)
// const sequelize = new Sequelize("test", "root", null, {
//   host: "localhost",
//   dialect: "mysql",
// });
// let connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected To MySql");
//   } catch (err) {
//     console.error("Unable to connect to the database:", error);
//   }
// };
// export default connectDB;

//====================================================================================
const { Sequelize } = require("sequelize");

// // Option 1: Passing a connection URI
// const sequelize = new Sequelize("sqlite::memory:"); // Example for sqlite
// const sequelize = new Sequelize("postgres://user:pass@example.com:5432/dbname"); // Example for postgres

// // Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: "mysql",
//   storage: "path/to/database.sqlite",
// });
// "username": "ezuchkfijelmvc",
// "password": "29b557dbc933edf7a1934494f17b001c6aadfdb24409d639c20962682ef090ea",
// "database": " d8d7dvin3ag32o",
// "host": "ec2-44-197-128-108.compute-1.amazonaws.com",
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  }
);
let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected To Heroku Mysql");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};
export default connectDB;
