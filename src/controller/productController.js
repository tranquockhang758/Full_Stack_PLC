import db from "../models/index";
//Tất cả thư mục nằm ở service và Controller chỉ để điều hướng
import { searchProduct } from "../services/productService";
export let getAllProduct = async (req, res) => {
  //Model Name bên file models/user.js tên là User
  try {
    let data = await db.tbl_list_product.findAll();
    if (data) {
      return res.status(200).json({
        product: data,
        errCode: 0,
      });
    } else {
      return res.status(200).json({
        Message: "Don't find any Data in DB",
        errCode: 1,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export let getProductSearch = async (req, res) => {
  try {
    let name = req.query.key;
    console.log("Checkc name", name);
    let data = await searchProduct(name);
    if (data) {
      return res.status(200).json({
        errCode: 0,
        Message: "Fetch Product successfully",
        data: data,
        key: name,
      });
    } else {
      return res.status(200).json({
        errCode: 1,
        Message: "Don't any Product in DB",
        key: name,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
