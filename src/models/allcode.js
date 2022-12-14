"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Allcode.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      Allcode.hasMany(models.User, {
        foreignKey: "gender",
        as: "genderData",
      });
      Allcode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });

      //Bảng allCode có mối quạn hệ với bảng Doctor_Info thông qua priceId
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "priceId",
        as: "priceType",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "paymentId",
        as: "paymentType",
      });
      Allcode.hasMany(models.Doctor_Info, {
        foreignKey: "provinceId",
        as: "provinceType",
      });

      Allcode.hasMany(models.Booking, {
        foreignKey: "timeType",
        as: "timeTypeDataPatient",
      });
    }
  }
  Allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueVi: DataTypes.STRING,
      valueEn: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Allcode",
    }
  );
  return Allcode;
};
