"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PLCs", {
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
        type: Sequelize.INTEGER,
      },
      Feedback: {
        type: Sequelize.INTEGER,
      },
      Current: {
        type: Sequelize.INTEGER,
      },
      Voltage: {
        type: Sequelize.INTEGER,
      },
      Frequency: {
        type: Sequelize.INTEGER,
      },
      DC_Link_Voltage: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("PLCs");
  },
};
