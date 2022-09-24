"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //     adddress: DataTypes.STRING,
    //   description: DataTypes.STRING,
    //   image: DataTypes.STRING,
    //   name: DataTypes.STRING,
    await queryInterface.createTable("clinics", {
      // name: DataTypes.STRING,
      // adddress: DataTypes.STRING,
      // image: DataTypes.BLOB("long"),
      // contentMarkdown: DataTypes.TEXT,
      // contentHtml: DataTypes.TEXT,
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      image: { type: Sequelize.BLOB("long") },
      contentHtml: {
        type: Sequelize.TEXT,
      },
      contentMarkdown: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("clinics");
  },
};
