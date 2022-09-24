import db from "../models/index";
import sequelize from "sequelize";
import { Op } from "sequelize";
export let searchProduct = (name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let listProduct = await db.tbl_list_product.findAll({
        where: {
          [sequelize.Op.or]: {
            namesQuery: sequelize.where(
              sequelize.fn(
                "concat",
                sequelize.col("product_title"),
                sequelize.col("data_brand")
              ),
              {
                [sequelize.Op.like]: `%${name}%`,
              }
            ),
            product_title: { [sequelize.Op.like]: `%${name}%` },
            data_brand: { [sequelize.Op.like]: `%${name}%` },
          },
        },
        raw: true,
      });
      if (listProduct) {
        resolve(listProduct);
      } else {
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
};
