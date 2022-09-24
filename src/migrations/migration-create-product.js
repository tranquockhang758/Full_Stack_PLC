"use strict";

const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_list_product", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      data_brand: {
        type: Sequelize.STRING,
      },
      data_cat: {
        type: Sequelize.STRING,
      },
      data_cat_english: {
        type: Sequelize.STRING,
      },
      product_title: {
        type: Sequelize.STRING,
      },
      new_price: {
        type: Sequelize.BIGINT(11),
      },
      old_price: {
        type: Sequelize.BIGINT(11),
      },
      product_thumb: {
        type: Sequelize.STRING,
      },
      code: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.STRING,
      },
      cat_id: {
        type: Sequelize.BIGINT(11),
      },
      product_desc: {
        type: Sequelize.STRING,
      },
      product_param: {
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
    await queryInterface.dropTable("tbl_list_product");
  },
};
