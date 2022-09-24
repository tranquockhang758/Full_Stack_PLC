import db from "../models/index";
import {
  createNewClinicAPI,
  getAllClinicAPI,
  getClinicByIdAPI,
  getDetailClinicByIdAPI,
} from "../services/clinicService";
export let createNewClinic = async (req, res) => {
  let data = await createNewClinicAPI(req.body);
  if (data) {
    return res.status(200).json(data);
  } else {
    return res
      .status(200)
      .json({ errCode: 1, Message: "Don't have data in here" });
  }
};

export let getAllClinic = async (req, res) => {
  try {
    let data = await getAllClinicAPI();
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    return res
      .status(200)
      .json({ errCode: 1, Message: `Have error in Situation ${e}` });
  }
};
export let getClinicById = async (req, res) => {
  try {
    let data = await getClinicByIdAPI(req.query.id);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    return res
      .status(200)
      .json({ errCode: 1, Message: `Have error in Situation ${e}` });
  }
};

export let getDetailClinicById = async (req, res) => {
  try {
    let data = await getDetailClinicByIdAPI(req.query.id);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    return res
      .status(200)
      .json({ errCode: 1, Message: `Have error in Situation ${e}` });
  }
};
