import db from "../models/index";
import jwt from "jsonwebtoken";

//Trong đây ta sẽ test lại mã Token của user khi đăng nhập
export let middlewareLogin = async (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    let accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ errCode: 1, Message: "Token is invalid or kill" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ errCode: 2, Message: "You're not Authenticated" });
  }
};
export let middlewareAdminAuth = (req, res, next) => {
  middlewareLogin(req, res, () => {
    if (req.user.id === req.body.id || req.user.roleId === "R1") {
      next();
    } else {
      res.status(403).json({ Message: "You're not allowed to delete Other" });
    }
  });
};
