"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PLC extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PLC.init(
    {
      Stop: DataTypes.BOOLEAN,
      Reverse: DataTypes.BOOLEAN,
      Forward: DataTypes.BOOLEAN,
      Setpoint: DataTypes.INTEGER,
      Feedback: DataTypes.INTEGER,
      Current: DataTypes.INTEGER,
      Voltage: DataTypes.INTEGER,
      Frequency: DataTypes.INTEGER,
      DC_Link_Voltage: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PLC",
    }
  );
  return PLC;
};
