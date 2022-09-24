import db from "../models/index";
import {
  getTopDoctorHomeAPI,
  getAllDoctorHomeAPI,
  saveInfoDoctorAPI,
  getDetailDoctorByIdAPI,
  bulkCreateScheduleService,
  getScheduleDoctorAPI,
  getExtraInfoDoctorByIdAPI,
  getProfileDoctorByIdAPI,
  patientBookAppointmentAPI,
  getListPatientForDoctorAPI,
  sendOrderAPI,
} from "../services/doctorService";

export let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) {
    limit = 10;
  }
  let topDoctor = await getTopDoctorHomeAPI(limit);
  if (topDoctor) {
    res.status(200).json({
      errCode: 0,
      Message: "Query is Successfully",
      users: topDoctor,
    });
  } else {
    res.status(200).json({
      errCode: 1,
      Message: "Don't find any User In DB",
    });
  }
};

export let getAllDoctorHome = async (req, res) => {
  // let limit = req.query.limit;
  // if (!limit) {
  //   limit = 5;
  // }
  let allDoctor = await getAllDoctorHomeAPI();
  if (allDoctor) {
    return res.status(200).json({
      errCode: 0,
      Message: "Query is Successfully",
      users: allDoctor,
    });
  } else {
    return res.status(200).json({
      errCode: 1,
      Message: "Don't find any User In DB",
    });
  }
};
export let saveInfoDoctor = async (req, res) => {
  try {
    let data = req.body;
    let response = await saveInfoDoctorAPI(data);
    if (response) {
      return res.status(200).json({ data: response });
    }
  } catch (e) {
    console.log(e);
  }
};

export let getDetailDoctorById = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(200).json({
        errCode: 2,
        Message: "Don't Find Any User",
      });
    } else {
      let data = await getDetailDoctorByIdAPI(req.query.id);
      return res.status(200).json(data);
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      Message: "Error From Server",
    });
  }
};

export let bulkCreateSchedule = async (req, res) => {
  try {
    let infor = await bulkCreateScheduleService(req.body);
    return res.status(200).json({ infor });
  } catch (e) {
    console.log(e);
  }
};

export let getScheduleDoctor = async (req, res) => {
  try {
    let scheduleDoctor = await getScheduleDoctorAPI(
      req.query.doctorId,
      req.query.date
    );
    if (scheduleDoctor) {
      return res.status(200).json({
        scheduleDoctor,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

export let getExtraInfoDoctorById = async (req, res) => {
  try {
    let Info_Doctor = await getExtraInfoDoctorByIdAPI(req.query.doctorId);
    if (Info_Doctor) {
      return res.status(200).json({
        Info_Doctor,
      });
    }
  } catch (e) {
    res.status(200).json({ errCode: 1, Message: "Have Error in Situation" });
  }
};

export let getProfileDoctorById = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(200).json({ errCode: -1, Message: "Don't have id" });
    }
    console.log(req.query.id);
    let Info_Doctor = await getProfileDoctorByIdAPI(req.query.id);
    if (Info_Doctor) {
      return res.status(200).json({
        Info_Doctor,
      });
    }
  } catch (e) {
    res.status(200).json({
      errCode: 1,
      Message: `Have Error in Situation with error is ${e}`,
    });
  }
};

export let getListPatientForDoctor = async (req, res) => {
  try {
    let listPatient = await getListPatientForDoctorAPI(
      req.query.doctorId,
      req.query.date
    );
    if (listPatient) {
      return res.status(200).json({
        listPatient,
      });
    }
  } catch (e) {
    res
      .status(200)
      .json({ errCode: 1, Message: `Have Error in Situation with ${e}` });
  }
};

export let sendOrder = async (req, res) => {
  try {
    let sendOrder = await sendOrderAPI(req.body);
    if (sendOrder) {
      return res.status(200).json(sendOrder);
    }
  } catch (e) {
    res
      .status(200)
      .json({ errCode: 1, Message: `Have Error in Situation with ${e}` });
  }
};
