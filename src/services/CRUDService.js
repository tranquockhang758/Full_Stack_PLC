import bcrypt from "bcryptjs";
import { raw } from "body-parser";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);
export let HashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt); //hashSync(s:string to hash, salt length to generate  or salt to use)
      resolve(hashPassword);
    } catch (err) {
      reject(err);
    }
  });
};
export let CreateNewUser = async (data) => {
  //================================================================Thiếu từ new ko thể chạy được
  return new Promise(async (resolve, reject) => {
    try {
      let HashPasswordFromUser = await HashUserPassword(data.password);
      // const jane = await User.create({ firstName: "Jane", lastName: "Doe" }); === INSERT INTO
      await db.User.create({
        email: data.email,
        password: HashPasswordFromUser,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address, //Hashh Password
        phoneNumber: data.phoneNumber,
        gender: data.gender === "1" ? true : false,
        image: data.image,
        roleId: data.role,
        positionId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      let newAllUser = db.User.findAll();
      resolve(newAllUser);
    } catch (e) {
      reject(e);
    }
  });
};

//=================================================================Hash Password
export let EditUser = async (req, res) => {
  return res.send("Edit");
};
export let getAllUser = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Khi để raw = true trả về 1 object
      let users = db.User.findAll({ raw: true });
      resolve(users);
      //   return res.render("home/allUsers.ejs");
    } catch (err) {
      reject(err);
    }
  });
};
export let getUserInfo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user_data = await db.User.findOne({ where: { id: id }, raw: true });
      if (user_data) {
        resolve(user_data);
      } else {
        resolve([]);
      }
    } catch (err) {
      reject(err);
    }
  });
};

//Update dữ liệu người dùng tại đây
export let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: data.id } });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        //Sau khi cập nhật Db rồi thì ta lấy tất cả dữ liệu trong đó và trả về để render không bị lỗi
        let allUsers = db.User.findAll({ raw: true });
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (err) {
      console.log(err);
    }
  });
};
export let deleteUserCrud = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({ where: { id: id } });
      if (user) {
        await user.destroy();
        let newAllUser = await db.User.findAll();
        resolve(newAllUser);
      } else {
        resolve();
      }
    } catch (err) {
      reject(err);
    }
  });
};
