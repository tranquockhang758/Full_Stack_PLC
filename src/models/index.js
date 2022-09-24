"use strict";
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.json")[env];
const db = {};
let customizeConfig = {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  // },
};
let sequelize;
sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  customizeConfig
);
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     config
//   );
// }

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
// if (Stop == true) {
//   Status_Code = 1;
//   node.writeSingleRegister(4, 3000);
//   node.writeSingleRegister(5, Status_Code);
// }
// if (Reverse == true) {
//   Status_Code = 4;
//   node.writeSingleRegister(4, 3000);
//   node.writeSingleRegister(5, Status_Code);
// }
// if (Forward == true) {
//   Status_Code = 2;
//   //4 Frequency , 5 Command Code
//   node.writeSingleRegister(4, 3000);
//   node.writeSingleRegister(5, Status_Code);
// }
