import db from "../models/index";
import {
  createNewSpecialtyAPI,
  getAllSpecialtyAPI,
  getSpecialtyByIdAPI,
  getDetailSpecialtyByIdAPI,
} from "../services/specialtyService.js";
export let createNewSpecialty = async (req, res) => {
  try {
    let data = await createNewSpecialtyAPI(req.body);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    return res
      .status(200)
      .json({ errCode: 1, Message: `Have error in Situation ${e}` });
  }
};

export let getAllSpecialty = async (req, res) => {
  try {
    let limit = req.query.limit;
    let data = await getAllSpecialtyAPI(limit);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    return res
      .status(200)
      .json({ errCode: 1, Message: `Have error in Situation ${e}` });
  }
};

export let getSpecialtyById = async (req, res) => {
  try {
    let specialty = await getSpecialtyByIdAPI(req.body.id);
    if (specialty) {
      return res.status(200).json(specialty);
    }
  } catch (e) {
    return res.status(200).json({
      errCode: 1,
      Message: `Have error in Situatuon with Exception is: ${e}`,
    });
  }
};
export let getDetailSpecialtyById = async (req, res) => {
  try {
    let detailSpecialty = await getDetailSpecialtyByIdAPI(
      req.query.id,
      req.query.location
    );
    if (detailSpecialty) {
      return res.status(200).json(detailSpecialty);
    }
  } catch (e) {
    return res.status(200).json({
      errCode: 1,
      Message: `Have error in Situatuon with Exception is: ${e}`,
    });
  }
};
