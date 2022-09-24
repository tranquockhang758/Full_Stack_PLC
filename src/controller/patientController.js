import {
  patientBookAppointmentAPI,
  patientBookAppointmentAPI1,
  postVerifyBookAppointmentAPI,
} from "../services/patientService.js";
export let patientBookAppointment = async (req, res) => {
  try {
    let appointment = await patientBookAppointmentAPI(req.body);
    if (appointment) {
      return res.status(200).json({ appointment });
    }
  } catch (e) {
    return res
      .status(200)
      .json({ errCode: 1, Message: "Have Error in Situation" });
  }
};

export let patientBookAppointment1 = async (req, res) => {
  try {
    let appointment = await patientBookAppointmentAPI1();
    return res.status(200).json(appointment);
  } catch (e) {
    res.status(200).json({ errCode: 1, Message: "Have Error in Situation" });
  }
};

export let postVerifyBookAppointment = async (req, res) => {
  try {
    console.log(req.body);
    let appointment = await postVerifyBookAppointmentAPI(req.body);
    return res.status(200).json(appointment);
  } catch (e) {
    res.status(200).json({ errCode: 1, Message: "Have Error in Situation" });
  }
};
