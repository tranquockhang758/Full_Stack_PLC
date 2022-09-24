import express from "express";
let router = express.Router();

const initWebRouterSocket = (app) => {
  router.get("/", (req, res) => {
    return res.send("Home Page");
  });

  return app.use("/", router);
};

export default initWebRouterSocket;
