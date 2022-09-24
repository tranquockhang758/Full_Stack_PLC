"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class tbl_list_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  tbl_list_product.init(
    {
      data_brand: DataTypes.STRING,
      data_cat: DataTypes.STRING,
      data_cat_english: DataTypes.STRING,
      product_title: DataTypes.STRING,

      new_price: DataTypes.STRING,
      old_price: DataTypes.BIGINT(11),
      product_thumb: DataTypes.BIGINT(11),
      code: DataTypes.STRING,

      content: DataTypes.STRING,
      cat_id: DataTypes.BIGINT(11),
      product_desc: DataTypes.STRING,
      product_param: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tbl_list_product",
    }
  );
  return tbl_list_product;
};
