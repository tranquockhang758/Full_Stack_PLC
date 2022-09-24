import db from "../models/index";
//Tất cả thư mục nằm ở service và Controller chỉ để điều hướng
import {
  CreateNewUser,
  EditUser,
  getAllUser,
  getUserInfo,
  updateUserData,
  deleteUserCrud,
} from "../services/CRUDService.js";
export let getHomePage = async (req, res) => {
  //Model Name bên file models/user.js tên là User
  try {
    let data = await db.User.findAll();
    return res.render("home/home.ejs", { data: data });
  } catch (e) {
    console.log(e);
  }
};

export let getDetailPage = async (req, res) => {
  return res.render("home/detail.ejs");
};
export let getCrud = async (req, res) => {
  return res.render("home/crud.ejs");
};

export let postCrud = async (req, res) => {
  // console.log(req.body);
  let newAllUser = await CreateNewUser(req.body);
  return res.render("home/alLUsers.ejs", { users: newAllUser });
};

export let getAllUsers = async (req, res) => {
  let users = await getAllUser(req, res);
  return res.render("home/alLUsers.ejs", { users: users });
};

//Sau khi ta vào route users/edit/1 thì render cho ta view chứa thông tin người dùng tương ứng với id.Sau đó ta sửa và click vào update
//Thì nó sẽ cập nhật dữ liệu ở DB
export let editUser = async (req, res) => {
  let id = req.query.id;
  if (id) {
    let user_data = await getUserInfo(id);
    if (user_data) {
      return res.render("home/editUsers.ejs", { user_data: user_data });
    }
  } else {
    return res.send("Users Not Found");
  }
  // return res.send("Edit User");
};

//Function lấy dữ liệu và Update dữ liệu vào DB sau đó render lại tất cả dữ liệu
export let putCrud = async (req, res) => {
  let data = req.body;
  let allUsers = await updateUserData(data);
  return res.render("home/alLUsers.ejs", { users: allUsers });
};

export let deleteUser = async (req, res) => {
  let id = req.query.id;
  if (id) {
    let newAllUser = await deleteUserCrud(id);
    if (newAllUser) {
      return res.render("home/alLUsers.ejs", { users: newAllUser });
    }
  } else {
    return res.send("Not Found User");
  }
  let newAllUser = await deleteUserCrud(id);
};
