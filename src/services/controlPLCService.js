import db from "../models/index";

export let updatePLCAPI = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Setpoint = data ? data.Setpoint : 1000;
      let SetpointConverse = parseFloat(Setpoint);
      let Forward = data ? data.Forward : 0;
      let ForwardConverse = Boolean(Forward);
      let Reverse = data ? data.Reverse : 0;
      let ReverseConverse = Boolean(Reverse);
      let Stop = data ? data.Stop : 0;
      let StopConverse = Boolean(Stop);
      let id = data ? data.id : 1;
      let idConverse = parseInt(id);
      let PLC = await db.PLC.findOne({
        where: { id: 1 },
      });
      if (PLC) {
        PLC.Setpoint = SetpointConverse;
        PLC.Forward = ForwardConverse;
        PLC.Reverse = ReverseConverse;
        PLC.Stop = StopConverse;
        await PLC.save();
      }
      //Nếu chưa có data ta 1 record mới
      else {
        await db.PLC.create({
          Forward: ForwardConverse,
          Stop: StopConverse,
          Reverse: ReverseConverse,
          Setpoint: SetpointConverse,
          Feedback: 0,
          Current: 0,
          Voltage: 0,
          Frequency: 0,
          DC_Link_Voltage: 0,
        });
      }
      resolve({ errCode: 0, Message: "Update Successfully" });
    } catch (e) {
      reject(e);
    }
  });
};
