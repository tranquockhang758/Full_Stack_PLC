import db from "../models/index";
import jwt from "jsonwebtoken";
import {
  checkEmail,
  handleUserLogin,
  getAllUsers,
  createNewUser,
  handleUpdateUser,
  handleDeleteUserFromAPI,
  getAllCodeAPI,
  getTopDoctorHomeAPI,
} from "../services/userService";
export let generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      admin: true,
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "30s" }
  );
};
export let generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      admin: true,
    },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: "1d" }
  );
};

export const handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res
      .status(500)
      .json({ errCode: 1, Message: "Missing input Requirement" });
  } else {
    let userData = await handleUserLogin(email, password);
    if (userData) {
      // let refreshToken = userData.refresh_token;
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   path: "/",
      //   sameSite: "strict",
      // });
      return res.status(200).json({
        errCode: userData.errCode,
        Message: userData.Message,
        userData,
      });
    }
  }
};
//Sau khi login ta có refreshToken lưu trong cookie. Ta tạo 1 controller mới để lấy refreshToken
export const refreshToken = async (req, res) => {
  let refreshToken = req.cookies.refreshToken;
  let email = req.body.email ? req.body.email : "";
  if (email !== "") {
    if (!refreshToken) {
      return res.status(401).json({ Message: "You're not authenticated" });
    } else {
      let user = await db.User.findOne({
        where: { email: email },
      });
      if (user) {
        //Nếu tìm được refreshToken trong DB ta lại verify token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
          if (err) {
            console.log(err);
          }
          const newAccessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken(user);
          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            path: "/",
            sameSite: "strict",
          });
          return res.status(200).json({
            accessToken: newAccessToken,
            errCode: 0,
            Message: "Refresh Token successfully",
          });
        });
      }
      return res.status(403).json({ Message: "refreshToken is not valid" });
    }
  } else {
    return res.status(401).json({ Message: "Cannot find User in DB" });
  }
};
export let userLogout = async (req, res) => {
  res.clearCookie("refreshToken");
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.cookies.refreshToken
  );
  return res.status(200).json({ Message: "Logout successfully" });
};
export let Handle1Login = async (req, res) => {
  return res.send("Ok1");
};
//Hàm sẽ lấy về 1 là allUser/1 users
// nếu link là api/users:id => req.query,
// api/users/:id     req.params
export let handleGetUsers = async (req, res) => {
  let id = req.body ? req.body.id : "";
  if (!id) {
    let users = await getAllUsers("");
    if (users) {
      return res.status(200).json({
        Message: "Has User is Found in Here",
        errCode: 0,
        code: 200,
        users: users,
      });
    }
  } else {
    let users = await getAllUsers(id);
    if (users) {
      return res.status(200).json({
        users: users,
        Message: "All Users is Received",
        errCode: 0,
        code: 200,
      });
    }
  }
};
//=========================================================API Create user
export let handleCreateNewUser = async (req, res) => {
  let message = await createNewUser(req.body);
  res.status(200).json({ message: message });
};
//=========================================================API Edit User
export let handleEditUser = async (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      Message: "Don't find any users in list",
    });
  }
  let message = await handleUpdateUser(req.body);
  if (message) {
    return res.status(200).json({
      errCode: 0,
      Message: "Updated your user",
    });
  }
};

export let handleDeleteUser = async (req, res) => {
  let id = req.body.id;
  console.log(id);
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      Message: "Don't find any users in list",
    });
  } else {
    let message = await handleDeleteUserFromAPI(id);
    if (message) {
      return res.status(200).json({
        errCode: 0,
        Message: "Deleted your user",
        message: message,
      });
    }
  }
};
export let handleTestDeleteUser = async (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      Message: "Don't find any users in list",
    });
  } else {
    let user = db.User.findOne({ where: { id: id } });
    if (user) {
      res.status(200).json({ Message: "Test Delete User successfully" });
    }
  }
};

export let getAllCode = async (req, res) => {
  try {
    //http://localhost:8000/api/allcode?type=gender
    let allcode = await getAllCodeAPI(req.query.type);
    if (allcode) {
      return res.status(200).json({
        errCode: 0,
        Message: "Found a data in DB",
        allCode: allcode,
      });
    } else {
      return res.status(200).json({
        errCode: 2,
        Message: "Don't have any Data in here",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      Message: "Don't find any data in Database",
      errCode: -1,
    });
  }
};
