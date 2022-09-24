import db from "../models/index";
export let createNewSpecialtyAPI = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.image ||
        !data.name ||
        !data.contentMarkdown ||
        !data.contentHtml
      ) {
        resolve({
          errCode: 1,
          Message: "Missing Required Parameters",
        });
      }
      await db.Specialty.create({
        image: data.image,
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

export let getAllSpecialtyAPI = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let limitRecode = parseInt(limit);
      let specialty = await db.Specialty.findAll({
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
      if (specialty) {
        specialty.map((item, index) => {
          item.image = Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
        resolve({
          errCode: 0,
          Message: "Fetch Specialty Successfully",
          specialty: specialty,
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

export let getSpecialtyByIdAPI = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 2,
          Message: "Don't have id in Here",
        });
      }
      let specialty = await db.Specialty.findOne({
        where: {
          id: id,
        },
        raw: false,
      });
      if (specialty) {
        resolve({
          errCode: 0,
          Message: "Fetch Specialty Successfully",
          specialty: specialty,
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
export let getDetailSpecialtyByIdAPI = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        resolve({
          errCode: 2,
          Message: "Missing Required Param",
        });
      } else {
        //==========================Find with location
        let doctorSpecialty;
        let specialty;
        specialty = await db.Specialty.findAll({
          where: {
            id: id,
          },
          attributes: ["contentHtml", "contentMarkdown"],
          raw: true,
          nest: true,
        });
        if (specialty) {
          //provinceId <=> PRO1,PRO2
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: id },
              attributes: ["doctorId", "provinceId"],
              raw: true,
              nest: true,
            });
          } else {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: { specialtyId: id, provinceId: location },
              attributes: ["doctorId", "provinceId"],
              raw: true,
              nest: true,
            });
          }
          resolve({
            errCode: 0,
            Message: "Fetch Specialty Successfully",
            specialty,
            doctorSpecialty,
          });
        }

        //==========================Find with location
      }
    } catch (e) {
      reject(e);
    }
  });
};
