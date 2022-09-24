import jwt from "jsonwebtoken";
require("dotenv").config();
export const createJWT = () => {
  let token = jwt.sign({ foo: "bar" }, process.env.JWT_ACCESS_TOKEN);
  console.log("Check token", token);
  return token;
};
