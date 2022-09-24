"use strict";

const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //     key: DataTypes.STRING,
    //   type: DataTypes.STRING,
    //   value_vi: DataTypes.STRING,
    //   value_en: DataTypes.STRING,
    await queryInterface.createTable("WiFis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ssid: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("WiFis");
  },
};
