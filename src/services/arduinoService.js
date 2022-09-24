import db from "../models/index";
import _ from "lodash";
export let ConfigWiFiAPI = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let ssid = data ? data.ssid : "";
      let password = data ? data.password : "";
      //Nếu có ssid và password
      if (ssid && password) {
        let Wifi = await db.Wifi.findOne({ where: { id: 1 } });
        //Nếu đã có Wifi ta cập nhật lại db
        if (Wifi) {
          Wifi.password = password;
          Wifi.ssid = ssid;
          await Wifi.save();
          resolve({
            errCode: 0,
            Message: "Update Param To Config Wifi successfully",
          });
        }
        //Nếu chưa có data ta tạo bản mới
        else {
          await db.Wifi.create({
            ssid: ssid,
            password: password,
          });
          resolve({
            errCode: 0,
            Message: "Create Param To Config Wifi successfully",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let readParamWifiAPI = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let param = await db.Wifi.findOne({ where: { id: 1 }, raw: true });
      if (param) {
        resolve({ errCode: 0, Message: "Successfully", data: param });
      }
    } catch (e) {
      reject(e);
    }
  });
};
