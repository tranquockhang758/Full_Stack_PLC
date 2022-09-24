import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import nodemailer from "nodemailer";
import {
  getHomePage,
  getDetailPage,
  getCrud,
  postCrud,
  getAllUsers,
  editUser,
  putCrud,
  deleteUser,
} from "../controller/homeController.js";
import {
  handleLogin,
  Handle1Login,
  handleGetUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
  handleTestDeleteUser,
  refreshToken,
  userLogout,
} from "../controller/userController.js";
import {
  getAllProduct,
  getProductSearch,
} from "../controller/productController.js";

import {
  getTopDoctorHome,
  getAllDoctorHome,
  saveInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleDoctor,
  getExtraInfoDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendOrder,
} from "../controller/doctorController";

import { getAllMarkdown } from "../controller/markdownController.js";

import {
  handleControlPLC,
  viewDataControl,
  ViewDataFromDB,
  updatePLC,
  writeDataToPLC,
  readDataFromPLC,
  ConnectPLC,
} from "../controller/controlPlcController.js";
import { simpleSendMail } from "../services/emailService";
import {
  middlewareLogin,
  middlewareAdminAuth,
} from "../controller/middlewareAuthController";
import {
  patientBookAppointment,
  postVerifyBookAppointment,
} from "../controller/patientController";

import {
  createNewSpecialty,
  getAllSpecialty,
  getSpecialtyById,
  getDetailSpecialtyById,
} from "../controller/specialtyController";

import {
  createNewClinic,
  getAllClinic,
  getClinicById,
  getDetailClinicById,
} from "../controller/clinicController";
import {
  ArduinoK1K3,
  ArduinoK2K4,
  controlArduino,
  ViewDataArduino,
  ConfigWiFi,
  readParamWifi,
  handlePzem,
} from "../controller/controlArduinoController";

import { SocketIOESP } from "../controller/SocketIOController";

let router = express.Router();

router.use(cookieParser());

const initWebRouter = (app) => {
  router.get("/", (req, res) => {
    return getHomePage(req, res);
  });
  router.get("/crud", (req, res) => {
    return getCrud(req, res);
  });
  router.post("/postCrud", (req, res) => {
    return postCrud(req, res);
  });
  router.get("/users", (req, res) => {
    return getAllUsers(req, res);
  });
  router.get("/users/edit", (req, res) => {
    return editUser(req, res);
  });
  // router.get("/users/delete", (req, res) => {
  //   return editUser(req, res);
  // });
  router.post("/putCrud", (req, res) => {
    return putCrud(req, res);
  });

  router.get("/users/delete", (req, res) => {
    return deleteUser(req, res);
  });

  //Những route từ ReactJS ta sẽ thêm tiền tố API
  router.post("/api/login", (req, res) => {
    return handleLogin(req, res);
  });

  // router.post("/api/refreshToken", (req, res) => {
  //   return refreshToken(req, res);
  // });
  router.post("/api/users/refreshToken", (req, res) => {
    return refreshToken(req, res);
  });
  //User phải sign-in rồi mới có thể sign-out được middlewareLogin
  router.post("/api/logout", (req, res) => {
    return userLogout(req, res);
  });

  //=================================================middlewareLogin
  //middlewareLogin
  router.get("/api/users/", (req, res) => {
    return handleGetUsers(req, res);
  });
  router.post("/api/users/create", (req, res) => {
    return handleCreateNewUser(req, res);
  });
  router.put("/api/users/edit", (req, res) => {
    return handleEditUser(req, res);
  });
  //  middlewareLogin
  router.delete("/api/users/delete", (req, res) => {
    return handleDeleteUser(req, res);
  });
  // middlewareAdminAuth
  router.delete("/api/delete/:id", (req, res) => {
    return handleTestDeleteUser(req, res);
  });

  //=================================================middlewareLogin

  router.get("/api/allcode", (req, res) => {
    return getAllCode(req, res);
  });
  7;
  //Lấy tất cả bác sỹ nổi bật
  router.get("/api/top-doctor-home", (req, res) => {
    return getTopDoctorHome(req, res);
  });

  router.get("/api/all-doctor-home", (req, res) => {
    return getAllDoctorHome(req, res);
  });
  router.post("/api/save-info-doctor", (req, res) => {
    return saveInfoDoctor(req, res);
  });
  router.get("/api/get-detail-doctor-by-id", (req, res) => {
    return getDetailDoctorById(req, res);
  });

  router.get("/api/markdown", (req, res) => {
    return getAllMarkdown(req, res);
  });

  router.get("/api/allproduct", (req, res) => {
    return getAllProduct(req, res);
  });
  router.get("/api/product", (req, res) => {
    return getProductSearch(req, res);
  });
  router.post("/api/bulk-create-schedule", (req, res) => {
    return bulkCreateSchedule(req, res);
  });

  router.get("/api/get-schedule-doctor", (req, res) => {
    return getScheduleDoctor(req, res);
  });

  router.get("/api/get-extra-info-doctor-by-id", (req, res) => {
    return getExtraInfoDoctorById(req, res);
  });

  router.get("/api/get-profile-doctor-by-id", (req, res) => {
    return getProfileDoctorById(req, res);
  });

  router.post("/api/patient-book-appointment", (req, res) => {
    return patientBookAppointment(req, res);
  });

  router.post("/api/verifyBookingAppointment", (req, res) => {
    return postVerifyBookAppointment(req, res);
  });

  router.post("/api/create-new-specialty", (req, res) => {
    return createNewSpecialty(req, res);
  });

  router.get("/api/get-all-specialty", (req, res) => {
    return getAllSpecialty(req, res);
  });

  router.post("/api/get-specialty-by-id", (req, res) => {
    return getSpecialtyById(req, res);
  });

  router.get("/api/get-detail-specialty-by-id", (req, res) => {
    return getDetailSpecialtyById(req, res);
  });

  router.post("/api/create-new-clinic", (req, res) => {
    return createNewClinic(req, res);
  });

  router.get("/api/get-all-clinic", (req, res) => {
    return getAllClinic(req, res);
  });

  router.get("/api/get-clinic-by-id", (req, res) => {
    return getClinicById(req, res);
  });

  router.get("/api/get-detail-clinic-by-id", (req, res) => {
    return getDetailClinicById(req, res);
  });

  router.get("/api/get-list-patient-for-doctor", (req, res) => {
    return getListPatientForDoctor(req, res);
  });

  router.post("/api/send-order", (req, res) => {
    return sendOrder(req, res);
  });
  router.post("/sendmail", async (req, res) => {
    const email = req.body.email;
    let transporter = nodemailer.createTransport({
      service: "gmail",
      // host: "smtp.ethereal.email",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_APP_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal passwordbraemwxvxjqrdgtq
      },
    });

    // send mail with defined transport object
    await transporter.sendMail(
      {
        from: "tranquockhang758@gmail.com", // sender address
        to: `${email}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
      },
      (err) => {
        if (err) {
          return res.status(200).json({ errCode: 1, Message: err });
        }
        return res
          .status(200)
          .json({ errCode: 0, Message: "Sent Email is Success!" });
      }
    );
  });

  router.get("/api/control", (req, res) => {
    return handleControlPLC(req, res);
  });
  router.get("/api/viewDataControl", (req, res) => {
    return viewDataControl(req, res);
  });

  router.get("/api/data_plc", (req, res) => {
    return ViewDataFromDB(req, res);
  });

  router.get("/api/control-arduino", (req, res) => {
    return controlArduino(req, res);
  });

  router.get("/api/ViewDataArduino", (req, res) => {
    return ViewDataArduino(req, res);
  });
  router.get("/api/updatePLC", (req, res) => {
    return updatePLC(req, res);
  });
  router.get("/api/readFromDataPLC", (req, res) => {
    return readDataFromPLC(req, res);
  });
  router.get("/api/writeDataToPLC", (req, res) => {
    return writeDataToPLC(req, res);
  });

  router.get("/api/connectPlc", (req, res) => {
    return ConnectPLC(req, res);
  });

  router.get("/api/arduino/K1K3", (req, res) => {
    return ArduinoK1K3(req, res);
  });

  router.get("/api/arduino/K2K4", (req, res) => {
    return ArduinoK2K4(req, res);
  });

  router.get("/api/wifi", (req, res) => {
    return ConfigWiFi(req, res);
  });

  router.get("/api/wifi/param", (req, res) => {
    return readParamWifi(req, res);
  });

  router.get("/api/pzem", (req, res) => {
    return handlePzem(req, res);
  });
  //Tiền tố phía trước mỗi route

  return app.use("/", router);
};

export default initWebRouter;
