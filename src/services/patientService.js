import db from "../models/index";
import { simpleSendMail } from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctocId, token) => {
  let result = "";
  result = `${process.env.URL_REACT}verify-booking?token=${token}&doctorId=${doctocId}`;
  return result;
};
export let patientBookAppointmentAPI = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.date ||
        !data.timeString ||
        !data.timeType ||
        !data.selectedGenders ||
        !data.address
      ) {
        resolve({ errCode: 2, Message: "Missing required parameter" });
      } else {
        // console.log(data);
        // return;
        let token = uuidv4();
        let redirectLink = buildUrlEmail(data.doctorId, token);

        await simpleSendMail({ data: data, redirectLink: redirectLink });
        let user = await db.User.findOrCreate({
          where: {
            email: data.email,
          },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGenders,
            address: data.address,
          },
        });
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            },
            //   statusId:,doctorId,patientId,date,timeType,createdAt,updatedAt
          });
        }
        resolve({
          errCode: 0,
          Message: "Create Booking Schedule Successfully",
          data: user,
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
// export let patientBookAppointmentAPI1 = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!data) {
//         resolve({ errCode: 1, Message: "Missing required parameter" });
//       } else {
//         //Dùng findOrCreate để cập nhật hoặc tạo ra 1 đơn hàng... với điều kiện kiểm tra dữ liệu trong db
//         resolve({ errCode: 0, Message: "patientBookAppointmentAPI" });
//       }
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

export let postVerifyBookAppointmentAPI = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({ errCode: 2, Message: "Missing Required parameter" });
      } else {
        //Sau khi click vào linh trên ta phải cập nhật lại bảng Booking trạng thái Status là S2 : Confirm ,S1: New
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({ errCode: 0, Message: "Saving Data Successfully" });
        } else {
          resolve({
            errCode: 2,
            Message: "appoiment has been activated or does not exist",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};
