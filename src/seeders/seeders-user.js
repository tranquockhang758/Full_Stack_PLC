"use strict";

module.exports = {
  // email: DataTypes.STRING,
  //     password: DataTypes.STRING,
  //     firstName: DataTypes.STRING,
  //     lastName: DataTypes.STRING,
  //     address: DataTypes.STRING,
  //     gender: DataTypes.BOOLEAN,
  //     roleId: DataTypes.STRING,
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", [
      // email: DataTypes.STRING,
      // password: DataTypes.STRING,
      // firstName: DataTypes.STRING,
      // lastName: DataTypes.STRING,
      // address: DataTypes.STRING,
      // phoneNumber: DataTypes.STRING,
      // gender: DataTypes.BOOLEAN,
      // image: DataTypes.STRING,
      // roleId: DataTypes.STRING,
      // positionId: DataTypes.STRING,
      {
        email: "tranquockhang758@gmail.com",
        password: "Tranquockhang123456",
        firstName: "Khang",
        lastName: "Tran",
        address: "116 8/3 Street Ward 5 Vinh Long City", //Hashh Password
        phoneNumber: "0367151014",
        gender: 1,
        image: "link to Image",
        roleId: "Admin",
        positionId: "P2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  },
};
