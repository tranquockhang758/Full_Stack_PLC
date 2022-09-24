"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Arduino extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Arduino.init(
    {
      Stop: DataTypes.BOOLEAN,
      Reverse: DataTypes.BOOLEAN,
      Forward: DataTypes.BOOLEAN,
      Setpoint: DataTypes.FLOAT,
      Feedback: DataTypes.FLOAT,
      Current: DataTypes.FLOAT,
      Voltage: DataTypes.FLOAT,
      Frequency: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Arduino",
    }
  );
  return Arduino;
};
