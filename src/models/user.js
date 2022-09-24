"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Allcode, {
        foreignKey: "positionId",
        targetKey: "keyMap",
        as: "positionData",
      });
      User.belongsTo(models.Allcode, {
        foreignKey: "gender",
        targetKey: "keyMap",
        as: "genderData",
      });
      //1 User có 1 doctorId bên bảng Markdown
      User.hasOne(models.Markdown, {
        //ForeignKey ở relationship 1-1 là key bảng muốn map tới
        foreignKey: "doctorId",
      });
      //1 User có 1 doctorId bên bảng Doctor_Info
      User.hasOne(models.Doctor_Info, {
        //ForeignKey ở relationship 1-1 là key bảng muốn map tới
        foreignKey: "doctorId",
      });

      //id bảng user map với doctorId bảng Schedule
      //One-to-Many => hasMany - this.belongsTo
      //foreignKey being defined in targetKey modelB => foreignKey nằm trên bảng B
      User.hasMany(models.Schedule, {
        foreignKey: "doctorId",
        as: "doctorData",
      });

      //1 User có thể có nhiều lịch hẹn
      User.hasMany(models.Booking, {
        foreignKey: "patientId",
        as: "patientData",
      });
    }
  }

  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      image: DataTypes.BLOB("long"),
      roleId: DataTypes.STRING,
      positionId: DataTypes.STRING,
      access_token: DataTypes.TEXT,
      refreshToken: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
