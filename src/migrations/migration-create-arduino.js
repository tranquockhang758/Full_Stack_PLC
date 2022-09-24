"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("arduinos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Stop: {
        type: Sequelize.BOOLEAN,
      },
      Reverse: {
        type: Sequelize.BOOLEAN,
      },
      Forward: {
        type: Sequelize.BOOLEAN,
      },
      Setpoint: {
        type: Sequelize.FLOAT,
      },
      Feedback: {
        type: Sequelize.FLOAT,
      },
      Current: {
        type: Sequelize.FLOAT,
      },
      Voltage: {
        type: Sequelize.FLOAT,
      },
      Frequency: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("arduinos");
  },
};
