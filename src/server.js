import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import configViewEngine from "./config/viewEngine";
import initWebRouter from "./route/web";
import connectDB from "./config/connectDB";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

require("dotenv").config();

const app = express();
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});
app.use(cors({ origin: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

initWebRouter(app);
configViewEngine(app);
app.use(cookieParser());
const PORT = process.env.PORT || 8000;

connectDB();

app.listen(PORT, () => {
  console.log(`App dang chay tren ${PORT}`);
});
