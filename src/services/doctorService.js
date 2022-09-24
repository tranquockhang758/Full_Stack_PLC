import db from "../models/index";
import _ from "lodash";
import { isBuffer } from "lodash";
require("dotenv").config();
import { sendAttachment } from "./emailService";
import { v4 as uuidv4 } from "uuid";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

export let getTopDoctorHomeAPI = async (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let topDoctor = await db.User.findAll({
        limit: limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (topDoctor) {
        resolve(topDoctor);
      } else {
        resolve([]);
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let getAllDoctorHomeAPI = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let allDoctor = await db.User.findAll({
        order: [["createdAt", "ASC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (allDoctor) {
        resolve(allDoctor);
      } else {
        resolve([]);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkFieldInput = (data) => {
  let isValid = true;
  let element = "";
  let arrFields = [
    "contentHTML",
    "contentMarkdown",
    "description",
    "action",
    "doctorId",
    "selectedPrice",
    "selectedProvince",
    "selectedPayment",
    "addressClinic",
    "nameClinic",
    "specialtyId",
    "clinicId",
  ];
  for (let i = 0; i < arrFields.length; i++) {
    //Nếu trống 1 trong các trường trên
    if (!data[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
    }
  }
  return { isValid: isValid, element: element };
};
export let saveInfoDoctorAPI = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkFieldInput(data);
      if (checkObj.isValid === false) {
        resolve({
          errCode: 1,
          errMessage: `Missing  Parameter ${checkObj.element}`,
        });
      } else {
        if (data.action === "create") {
          await db.Markdown.create({
            contentHTML: data.contentHtml,
            contentMarkdown: data.contentMarkdown,
            description: data.description,
            doctorId: data.doctorId,
            clinicId: data.clinicId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await db.Doctor_Info.create({
            doctorId: data.doctorId,
            priceId: data.selectedPrice,
            provinceId: data.selectedProvince,
            paymentId: data.selectedPayment,
            addressClinic: data.addressClinic,
            nameClinic: data.nameClinic,
            note: data.note,
            specialtyId: data.specialtyId,
            specialtyId: data.specialtyId,
            clinicId: data.clinicId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          resolve({
            errCode: 0,
            errMessage: "Create New Info Doctor Successfully",
          });
        }
        //Update Doctor Table Markdown And table Doctor_Info
        else if (data.action === "update") {
          //Khi vào update ta có 2 trường hợp là khi bảng doctorInfo có rồi mà bảng Doctor_Info chưa có
          let doctor = await db.Markdown.findOne({
            where: { doctorId: data.doctorId },
            raw: false,
          });
          if (doctor) {
            doctor.contentHTML = data.contentHtml;
            doctor.contentMarkdown = data.contentMarkdown;
            doctor.description = data.description;
            doctor.clinicId = data.clinicId;
            doctor.updatedAt = new Date();
            await doctor.save();
          }
          let doctorUpdate = await db.Doctor_Info.findOne({
            where: { doctorId: data.doctorId },
            raw: false,
          });
          if (doctorUpdate) {
            (doctorUpdate.doctorId = data.doctorId),
              (doctorUpdate.priceId = data.selectedPrice),
              (doctorUpdate.provinceId = data.selectedProvince),
              (doctorUpdate.paymentId = data.selectedPayment),
              (doctorUpdate.addressClinic = data.addressClinic),
              (doctorUpdate.nameClinic = data.nameClinic),
              (doctorUpdate.note = data.note),
              (doctorUpdate.clinicId = data.clinicId),
              (doctorUpdate.specialtyId = data.specialtyId),
              (doctorUpdate.updatedAt = new Date()),
              await doctorUpdate.save();
            //Sau khi cập nhật Db rồi thì ta lấy tất cả dữ liệu trong đó và trả về để render không bị lỗi
            resolve({
              errCode: 0,
              Message: "Updated users is successfully",
            });
          } else {
            await db.Doctor_Info.create({
              doctorId: data.doctorId,
              priceId: data.selectedPrice,
              provinceId: data.selectedProvince,
              paymentId: data.selectedPayment,
              addressClinic: data.addressClinic,
              nameClinic: data.nameClinic,
              note: data.note,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            resolve({
              errCode: 0,
              Message: "Create Doctor_Info is successfully",
            });
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let getDetailDoctorByIdAPI = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          //Include là join 2 table
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceType",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          //Ta convert ảnh từ phía server
          data.image = Buffer.from(data.image, "base64").toString("binary");
          resolve({
            doctorInfo: data,
            errCode: 0,
            Message: "Fetch Data From Server Successfully",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Don't find any Data in Db",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formattedDate) {
        return { errCode: 1, Message: "Missing Parameter" };
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item, index) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        //{ doctorId: 2, date: 1654621200000, timeType: 'T1', maxNumber: '10' }
        let existingSchedule = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formattedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        //Date ở DB là dạng timeStamp => ta phải convert lại dạng string để so sánh
        // if (existingSchedule && existingSchedule.length > 0) {
        //   existingSchedule = existingSchedule.map((item) => {
        //     item.date = new Date(item.date).getTime();
        //     return item;
        //   });
        // }
        //Hàm differenceBy sẽ so sánh dữ liệu gửi lên từ React với dữ liệu tìm trong db
        let toCreate = _.differenceWith(schedule, existingSchedule, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        // console.log("Check toCreate:", toCreate);

        resolve({ errCode: 0, Message: "BulkCreate Successfully " });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export let getScheduleDoctorAPI = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({ errCode: 1, Message: "Missing required Parameter" });
      } else {
        let schedule = await db.Schedule.findAll({
          where: {
            date: date,
            doctorId: doctorId,
          },
          //Bảng schedule liên kết với bảng User và bảng allCode
          //Bảng allCode lấy ra timeType
          //Bảng user lấy ra firstName,lastName
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (schedule) {
          resolve({
            schedule: schedule,
            errCode: 0,
            Message: "Fetch Schedule Successfully",
          });
        } else {
          resolve({
            schedule: [],
            errCode: 2,
            Message: "Don't have record in DB",
          });
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export let getExtraInfoDoctorByIdAPI = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 2,
          Message: "Missing required parameter",
        });
      } else {
        let data = await db.Doctor_Info.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceType",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceType",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentType",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data) {
          resolve({
            data: data,
            errCode: 0,
            Message: "Fetch Data Successfully",
          });
        } else {
          resolve({
            errCode: 2,
            Message: "Don't have any Data in DB",
          });
        }
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export let getProfileDoctorByIdAPI = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: id },
          // Include là join 2 table
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceType",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          //Ta convert ảnh từ phía server
          data.image = Buffer.from(data.image, "base64").toString("binary");
          resolve({
            doctorInfo: data,
            errCode: 0,
            Message: "Fetch Data From Server Successfully",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Don't find any Data in Db",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let getListPatientForDoctorAPI = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({ errCode: 2, Message: "Missing Required Param" });
      } else {
        let dataPatient = await db.Booking.findAll({
          where: {
            doctorId: doctorId,
            statusId: "S2",
            date: date,
          },
          include: [
            //Bảng allCode để lấy chức danh User => tren bảng booking có patientId,timeType ,statusId
            {
              model: db.User,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "address",
                "gender",
                "lastName",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            //Allcode
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        resolve({
          dataPatient,
          errCode: 0,
          Message: "Fetch Data Successfully",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export let sendOrderAPI = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // || !data.doctorId || !data.patientId
      if (!data.email || !data.timeType || !data.doctorId || !data.patientId) {
        resolve({ errCode: 2, Message: "Missing Required Parameter" });
      } else {
        //Sau khi có thông số ta phải cập nhật lại bảng booking là S3 vì S3 là xác nhận
        //Send mail
        // console.log(data);
        // return;
        let appointment = await db.Booking.findOne({
          where: {
            statusId: "S2",
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
          },
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }
        await sendAttachment(data);
        resolve({ errCode: 0, Message: "OK", appointment: appointment });
      }
    } catch (err) {
      reject(err);
    }
  });
};
