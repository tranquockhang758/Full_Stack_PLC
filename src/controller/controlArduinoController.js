import db from "../models/index";
import { ConfigWiFiAPI, readParamWifiAPI } from "../services/arduinoService";
export let controlArduino = async (req, res) => {
  let id = req.query.id;
  let idConverse = parseInt(id);
  if (idConverse) {
    let Setpoint = req.query ? req.query.Setpoint : 1000;
    let SetpointConverse = parseInt(Setpoint);
    let Forward = req.query ? req.query.Forward : 0;
    // let ForwardConverse = Boolean(Forward);
    let Reverse = req.query ? req.query.Reverse : 0;
    // let ReverseConverse = Boolean(Reverse);
    let Stop = req.query ? req.query.Stop : 0;
    // let StopConverse = Boolean(Stop);
    let Current = req.query ? req.query.Current : 0;
    let CurrentConverse = parseInt(Current);
    let Voltage = req.query ? req.query.Voltage : 0;
    let VoltageConverse = parseInt(Voltage);
    let Frequency = req.query ? req.query.Frequency : 0;
    let FrequencyConverse = parseInt(Frequency);
    let Arduino = await db.Arduino.findOne({ where: { id: id } });
    //Nếu tồn tại Bản ghi với id rồi
    console.log(Forward);
    console.log(Reverse);
    console.log(Stop);
    if (Arduino) {
      Arduino.Setpoint = SetpointConverse;
      Arduino.Stop = Stop;
      Arduino.Reverse = Reverse;
      Arduino.Forward = Forward;
      await Arduino.save();
    } else {
      await db.Arduino.create({
        Stop: Stop,
        Reverse: Reverse,
        Forward: Forward,
        Setpoint: SetpointConverse,
        Feedback: 0,
        Current: CurrentConverse,
        Voltage: VoltageConverse,
        Frequency: FrequencyConverse,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return res.status(200).json({
      errCode: 0,
      message: "Upadte data successfully",
    });
  }
};

export let ViewDataArduino = async (req, res) => {
  try {
    let id = req.query.id;
    let Feedback = req.query ? req.query.Feedback : 0;
    let FeedbackConverse = parseInt(Feedback);
    if (id) {
      let Arduino = await db.Arduino.findOne({ where: { id: id } });
      // let FeedbackConverse = parseInt(Fee  dback);
      if (Arduino) {
        Arduino.Feedback = FeedbackConverse;
        await Arduino.save();
      }
      return res.status(200).json({
        Feedback: Feedback,
        data: Arduino,
        message: "Data Fetch in DB",
        errCode: 0,
      });
    } else {
      return res.status(200).json({
        errCode: 1,
        Message: "Don't find Arduino in DB",
      });
    }
  } catch (err) {
    console.log(`Error is ${err}`);
  }
};

export let ArduinoK1K3 = async (req, res) => {
  let id = req.query.id;
  let idConverse = parseInt(id);
  if (idConverse) {
    let K1K3 = req.query ? req.query.K1K3 : 0;

    let Arduino = await db.Arduino.findOne({ where: { id: id } });
    //Nếu tồn tại Bản ghi với id rồi
    if (Arduino) {
      Arduino.Forward = K1K3;
      await Arduino.save();
    } else {
      await db.Arduino.create({
        Stop: StopConverse,
        Reverse: 0,
        Forward: K1K3,
        Setpoint: 0,
        Feedback: 0,
        Current: 0,
        Voltage: 0,
        Frequency: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return res.status(200).json({
      errCode: 0,
      message: "Upadte data successfully",
    });
  }
};

export let ArduinoK2K4 = async (req, res) => {
  let id = req.query.id;
  let idConverse = parseInt(id);
  if (idConverse) {
    let K2K4 = req.query ? req.query.K2K4 : 0;
    let Arduino = await db.Arduino.findOne({ where: { id: id } });
    //Nếu tồn tại Bản ghi với id rồi
    if (Arduino) {
      Arduino.Reverse = K2K4;
      await Arduino.save();
    } else {
      await db.Arduino.create({
        Stop: StopConverse,
        Reverse: K2K4,
        Forward: 0,
        Setpoint: 0,
        Feedback: 0,
        Current: 0,
        Voltage: 0,
        Frequency: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return res.status(200).json({
      errCode: 0,
      message: "Upadte data successfully",
    });
  }
};

export let ConfigWiFi = async (req, res) => {
  try {
    //Gửi ssid và password lên đây
    let data = await ConfigWiFiAPI(req ? req.query : "");
    return res.status(200).json(data);
  } catch (e) {
    console.log(e);
  }
};

export let readParamWifi = async (req, res) => {
  try {
    let data = await readParamWifiAPI();
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    console.log(e);
  }
};
export let handlePzem = async (req, res) => {
  try {
    return res.status(200).json({ errCode: 0, message: "Ok" });
  } catch (e) {
    console.log(e);
  }
};
