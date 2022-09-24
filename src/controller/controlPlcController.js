import db from "../models/index";
import { updatePLCAPI } from "../services/controlPLCService";
const { OPCUAClient, AttributeIds } = require("node-opcua");
const async = require("async");
export let handleControlPLC = async (req, res, err) => {
  const endpointUrl = "opc.tcp://192.168.0.20:4840";
  const client = OPCUAClient.create({ endpointMustExist: false });
  let the_session;
  let Setpoint = req.query ? req.query.Setpoint : 1000;
  let SetpointConverse = parseFloat(Setpoint);
  let Forward = req.query ? req.query.Forward : 0;
  let ForwardConverse = Boolean(Forward);
  let Reverse = req.query ? req.query.Reverse : 0;
  let ReverseConverse = Boolean(Reverse);
  let Stop = req.query ? req.query.Stop : 0;
  let StopConverse = Boolean(Stop);
  client.on("backoff", (retry, delay) =>
    console.log(
      `try to connect to ${endpointUrl},retry ${retry},next attempt ${
        delay / 1000
      } s`
    )
  );

  //connection
  async.series([
    // connect
    function (callback) {
      client.connect(endpointUrl, (err) => {
        if (err) {
          console.log(" cannot connect to endpoint :", endpointUrl);
        } else {
          console.log(`connected to PLC ${endpointUrl}`);
        }
        callback();
      });
    },
    // createSession
    function (callback) {
      client.createSession((err, session) => {
        if (err) {
          return;
        }
        the_session = session;
        callback();
      });
    },

    //Cập nhật lại giá trị DB
    async function (callback) {
      let PLC = await db.Control_PLC.findOne({ where: { id: 1 } });
      if (PLC) {
        PLC.Stop = StopConverse;
        PLC.Reverse = Reverse;
        PLC.Forward = Forward;
        PLC.Setpoint = Setpoint;
        await PLC.save();
      } else {
        await db.Control_PLC.create({
          Stop: StopConverse,
          Reverse: ReverseConverse,
          Forward: ForwardConverse,
          Setpoint: SetpointConverse,
        });
      }
    },
    //write
    async function () {
      let nodesTowrite = [
        {
          //gá»­i Setpoint PID lÃªn plc
          nodeId: "ns=4;i=19",
          attributeId: AttributeIds.Value,
          value: /*new data value */ {
            value: {
              dataType: 4,
              value: SetpointConverse,
            },
          },
        },
        //Forward
        {
          nodeId: "ns=4;i=48",
          attributeId: AttributeIds.Value,
          value: /*new data value */ {
            value: {
              dataType: 1,
              value: ForwardConverse,
            },
          },
        },
        //Reverse
        {
          nodeId: "ns=4;i=49",
          attributeId: AttributeIds.Value,
          value: /*new data value */ {
            value: {
              dataType: 1,
              value: ReverseConverse,
            },
          },
        },
        {
          nodeId: "ns=4;i=50",
          attributeId: AttributeIds.Value,
          value: /*new data value */ {
            value: {
              dataType: 1,
              value: StopConverse,
            },
          },
        },
      ];
      await the_session.write(nodesTowrite, (err, StatusCodes) => {
        if (!err) {
          client.disconnect(function () {
            console.log("Done Update");
          });
        }
      });
    },
    function (err) {
      if (err) {
        console.log(" failure ", err);
      } else {
        console.log("done!");
      }
    },
    function () {},
  ]);
};

export let viewDataControl = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      // let scada = await db.Control_PLC.findAll({ raw: true });
      // console.log("Check scada", scada);
      const endpointUrl = "opc.tcp://192.168.0.20:4840";
      const client = OPCUAClient.create({ endpointMustExist: false });
      client.on("backoff", (retry, delay) =>
        console.log(
          `try to connect to ${endpointUrl},retry ${retry},next attempt ${
            delay / 1000
          } s`
        )
      );
      await client.connect(endpointUrl);
      const session = await client.createSession();
      let Feedback = await session.read({ nodeId: "ns=4;i=6" });
      let Setpoint = await session.read({ nodeId: "ns=4;i=19" });
      let Current = await session.read({ nodeId: "ns=4;i=61" });
      let Frequency = await session.read({ nodeId: "ns=4;i=62" });
      let Voltage = await session.read({ nodeId: "ns=4;i=63" });
      let PLC = await db.Control_PLC.findOne({ where: { id: 1 } });
      if (PLC) {
        PLC.Feedback = Feedback.value.value;
        PLC.Current = Current.value.value;
        PLC.Frequency = Frequency.value.value;
        PLC.Voltage = Voltage.value.value;
        await PLC.save();
      }
      await session.close();
      await client.disconnect();
      return res.status(200).json({
        Message: "Ok",
        errCode: 0,
        Data_PLC: PLC,
      });
    } catch (e) {
      console.log(`Error is ${e}`);
    }
  });
};

export let ViewDataFromDB = async (req, res) => {
  let Data_PLC = await db.Control_PLC.findAll({ raw: true });
  if (Data_PLC.length > 0) {
    return res.status(200).json({
      Message: "Ok",
      errCode: 0,
      Data_PLC: Data_PLC,
    });
  } else {
    return res.status(200).json({
      Message: "Don't have any Data in here",
      errCode: 1,
    });
  }
};

export let updatePLC = async (req, res) => {
  try {
    let data = await updatePLCAPI(req.query);
    if (data) {
      return res.status(200).json(data);
    }
  } catch (e) {
    return res.status(200).json({ errCode: 1, Message: `Error is ${e}` });
  }
};

export let writeDataToPLC = async (req, res) => {
  try {
    let PLC = await db.PLC.findAll();
    let dataWritePLC = await db.PLC.findOne({
      where: { motorId: 1 },
      limit: 1,
      order: [["id", "DESC"]],
      raw: true,
    });
    if (dataWritePLC) {
      const endpointUrl = "opc.tcp://192.168.1.39:4840";
      const client = OPCUAClient.create({ endpointMustExist: false });
      let the_session;
      //Sau khi cập nhật DB ta gọi API này để ghi dữ liệu vào PLC
      let Setpoint = dataWritePLC.Setpoint;
      let Forward = dataWritePLC.Forward;
      let ForwardConverse = Boolean(Forward);
      let Reverse = dataWritePLC.Reverse;
      let ReverseConverse = Boolean(Reverse);
      let Stop = dataWritePLC.Stop;
      let StopConverse = Boolean(Stop);
      // console.log("Check reverse", ReverseConverse, typeof ReverseConverse);
      client.on("backoff", (retry, delay) =>
        console.log(
          `try to connect to ${endpointUrl},retry ${retry},next attempt ${
            delay / 1000
          } s`
        )
      );
      // //connection
      async.series([
        //connect
        function (callback) {
          client.connect(endpointUrl, (err) => {
            if (err) {
              console.log(" cannot connect to endpoint :", endpointUrl);
            } else {
              console.log(`connected to PLC ${endpointUrl}`);
            }
            callback();
          });
        },
        // createSession
        function (callback) {
          client.createSession((err, session) => {
            if (err) {
              return;
            }
            the_session = session;
            callback();
          });
        },
        //write
        async function () {
          let nodesTowrite = [
            {
              //gá»­i Setpoint PID lÃªn plc
              nodeId: "ns=4;i=139",
              attributeId: AttributeIds.Value,
              value: /*new data value */ {
                value: {
                  dataType: 4,
                  value: Setpoint,
                },
              },
            },
            //======================Forward
            {
              nodeId: "ns=4;i=48",
              attributeId: AttributeIds.Value,
              value: /*new data value */ {
                value: {
                  dataType: 1,
                  value: ForwardConverse,
                },
              },
            },
            //======================Reverse
            {
              nodeId: "ns=4;i=140",
              attributeId: AttributeIds.Value,
              value: /*new data value */ {
                value: {
                  dataType: 1,
                  value: ReverseConverse,
                },
              },
            },
            //======================Stop
            {
              nodeId: "ns=4;i=50",
              attributeId: AttributeIds.Value,
              value: /*new data value */ {
                value: {
                  dataType: 1,
                  value: StopConverse,
                },
              },
            },
          ];
          await the_session.write(nodesTowrite, (err, StatusCodes) => {
            if (!err) {
              client.disconnect(function () {
                console.log("Done Update");
                // return res.status(200).json({
                //   errCode: 0,
                //   Message: "Fetch Data OK",
                //   Data_PLC: PLC,
                //   dataWritePLC: dataWritePLC,
                // });
              });
            }
          });
        },
        function (err) {
          if (err) {
            console.log(" failure ", err);
          } else {
            console.log("done!");
            // return res.status(200).json({
            //   errCode: 0,
            //   Message: "Fetch Data OK",
            //   Data_PLC: PLC,
            //   dataWritePLC: dataWritePLC,
            // });
          }
        },
      ]);
      return res.status(200).json({
        errCode: 0,
        Message: "Fetch Data OK",
        Data_PLC: PLC,
        dataWritePLC: dataWritePLC,
      });
    }
  } catch (e) {
    return res.status(200).json({ errCode: 1, Message: `Error is ${e}` });
  }
};

export let readDataFromPLC = async (req, res) => {
  try {
    // let scada = await db.Control_PLC.findAll({ raw: true });
    // console.log("Check scada", scada);
    const endpointUrl = "opc.tcp://192.168.1.39:4840";
    const client = OPCUAClient.create({ endpointMustExist: false });
    client.on("backoff", (retry, delay) =>
      console.log(
        `try to connect to ${endpointUrl},retry ${retry},next attempt ${
          delay / 1000
        } s`
      )
    );
    await client.connect(endpointUrl);
    const session = await client.createSession();
    let Feedback = await session.read({ nodeId: "ns=4;i=126" });
    let Setpoint = await session.read({ nodeId: "ns=4;i=139" });
    let Current = await session.read({ nodeId: "ns=4;i=61" });
    let Frequency = await session.read({ nodeId: "ns=4;i=62" });
    let Voltage = await session.read({ nodeId: "ns=4;i=63" });
    let DC_Link_Voltage = await session.read({ nodeId: "ns=4;i=64" });
    let PLC = await db.PLC.findOne({
      where: { motorId: 1 },
      limit: 1,
      order: [["id", "DESC"]],
      raw: true,
    });
    // console.log("DataPLC", DC_Link_Voltage);
    if (PLC) {
      PLC.Feedback = Feedback.value.value;
      PLC.Current = Current.value.value;
      PLC.Frequency = Frequency.value.value;
      PLC.Voltage = Voltage.value.value;
      PLC.DC_Link_Voltage = DC_Link_Voltage.value.value;
      await PLC.save();
    }
    await session.close();
    await client.disconnect();
    return res.status(200).json({
      Message: "Fetch data Successfully",
      errCode: 0,
      Data_PLC: PLC,
    });
  } catch (e) {
    console.log(`Error is ${e}`);
  }
};
