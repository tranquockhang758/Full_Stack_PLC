require("dotenv").config();
import nodemailer from "nodemailer";
export const simpleSendMail = async ({ data, redirectLink }) => {
  let email = data.email;
  // let date = data.date;
  let doctorName = data.doctorName;
  // // //8:00 AM - 9:00 AM - Sun - 06/12/2022
  let timeString = data.timeString;
  let redirectLinkSendMail = redirectLink;
  let language = data.language;
  let fullname = data.fullname;
  let reason = data.reason;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_APP_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  await transporter.sendMail({
    //thuyduongnguyenvl1999@gmail.com
    //Nguyenleminhhuyen2018@gmail.com
    //phuongduytran1606@gmail.com
    //khuongnono@gmail.com
    from: process.env.EMAIL_APP_USERNAME, // sender address
    to: `${email}`, // list of receivers
    subject: `Gửi email test đến ${email}`, // Subject line
    subject: "Test Booking Schedule", // Subject line
    text: "...!!!!!!!!!!!", // plain text body
    html: getBodyHTMLEmail(
      language,
      email,
      doctorName,
      timeString,
      fullname,
      redirectLinkSendMail,
      reason
    ), // html body
  });
};

let getBodyHTMLEmail = (
  language,
  email,
  doctorName,
  timeString,
  fullname,
  redirectLinkSendMail,
  reason
) => {
  let result = "";
  if (language === "vi") {
    result = `<h3>Xin chào ${fullname}!!  với email : ${email} - với ngôn ngữ là tiếng việt</h3>
    <div>Bạn vừa đặt lịch hẹn khám bệnh lúc: ${timeString} với bác sỹ là ${doctorName}</div>
    <div>Lí do đặt lịch là ${reason}</div>
    <div>Để xác nhận đơn khám bệnh vui lòng click vào link sau:</div>
    <div><a href=${redirectLinkSendMail}>Click here</a></div>
    <div>Xin chân thành cảm ơn</div>
  `;
  }
  if (language === "en") {
    result = `<h3>Welcome to ${fullname}!!  với email : ${email} - with language is English</h3>
    <div>You are Booking appoiment: ${timeString} with a Doctor ${doctorName}</div>
    <div>To Confirm a Booking Schedule Please to click here</div>
    <div><a href=${redirectLinkSendMail}>Click here</a></div>
    <div>Dear</div>
  `;
  }
  return result;
};

export let sendAttachment = async (data) => {
  let email = data.email;
  let patientName = data.patientName;

  let image = data.image;
  let language = data.language;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_APP_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  await transporter.sendMail({
    //thuyduongnguyenvl1999@gmail.com
    //Nguyenleminhhuyen2018@gmail.com
    //phuongduytran1606@gmail.com
    //khuongnono@gmail.com
    from: process.env.EMAIL_APP_USERNAME, // sender address
    to: `${email}`, // list of receivers
    subject: `Gửi email test đến ${email}`, // Subject line
    subject: "Test Booking Schedule", // Subject line
    text: "...!!!!!!!!!!!", // plain text body
    html: getBodyHTMLEmailRemedy(language, email), // html body
    attachments: [
      {
        filename: `Order-${data.patientName}-${new Date().getTime()}.png`,
        content: data.image.split("base64,")[1],
        encoding: "base64",
      },
    ],
  });
};

let getBodyHTMLEmailRemedy = (language, email) => {
  let result = "";
  if (language === "vi") {
    result = `<h3>Xin chào name với email là ${email}</h3>
    <div>Xin chân thành cảm ơn</div>
    <div>Bạn nhận được lịch khám bệnh online!!!</div>
    <div>Thông tin đơn thuốc được gửi trong file đính kèm</div>
  `;
  }
  if (language === "en") {
    result = `<h3>Dear name with email :${email}</h3>
    <div>Bạn nhận được lịch khám này</div>
    <div>To Confirm a Booking Schedule Please to click here</div>
  `;
  }
  return result;
};
