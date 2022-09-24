import db from "../models/index";
export let createNewClinicAPI = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.image ||
        !data.name ||
        !data.address ||
        !data.contentMarkdown ||
        !data.contentHtml
      ) {
        resolve({
          errCode: 1,
          Message: "Missing Required Parameters",
        });
      }

      await db.Clinic.create({
        image: data.image,
        address: data.address,
        name: data.name,
        contentHtml: data.contentHtml,
        contentMarkdown: data.contentMarkdown,
      });
      resolve({ errCode: 0, Message: "Create New Specialty Successfully" });
    } catch (e) {
      reject(e);
    }
  });
};

export let getAllClinicAPI = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      // let limitRecode = parseInt(limit);
      let clinic = await db.Clinic.findAll({
        // limit: limitRecode,
        order: [["id", "ASC"]],
        // attributes: {
        //   exclude: ["password"],
        // },
        // include: [
        //   {
        //     model: db.Allcode,
        //     as: "positionData",
        //     attributes: ["valueEn", "valueVi"],
        //   },
        //   {
        //     model: db.Allcode,
        //     as: "genderData",
        //     attributes: ["valueEn", "valueVi"],
        //   },
        // ],
        raw: true,
        nest: true,
      });
      if (clinic) {
        clinic.map((item, index) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
        resolve({
          errCode: 0,
          Message: "Fetch Specialty Successfully",
          clinic: clinic,
        });
      } else {
        resolve({
          errCode: 3,
          Message: "Fetch Specialty Failed and don't have any record ",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let getClinicByIdAPI = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 2,
          Message: "Don't have id in Here",
        });
      }
      let clinic = await db.Clinic.findOne({
        where: {
          id: id,
        },
        raw: false,
      });
      if (clinic) {
        resolve({
          errCode: 0,
          Message: "Fetch Specialty Successfully",
          clinic: clinic,
        });
      } else {
        resolve({
          errCode: 3,
          Message: "Don't have Record in DB",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

export let getDetailClinicByIdAPI = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 2,
          Message: "Missing Required Param",
        });
      } else {
        //==========================Find with location
        let doctorClinic;
        let clinic;
        clinic = await db.Clinic.findAll({
          where: {
            id: id,
          },
          attributes: ["contentHtml", "contentMarkdown", "name", "address"],
          raw: true,
          nest: true,
        });
        if (clinic) {
          //Tìm tất cả bác sỹ có clinicId thuộc bệnh viện
          //provinceId <=> PRO1,PRO2
          doctorClinic = await db.Doctor_Info.findAll({
            where: { clinicId: id },
            attributes: ["doctorId", "provinceId"],
            raw: true,
            nest: true,
          });
        }
        resolve({
          errCode: 0,
          Message: "Fetch Specialty Successfully",
          clinic,
          doctorClinic,
        });

        //==========================Find with location
      }
    } catch (e) {
      reject(e);
    }
  });
};
