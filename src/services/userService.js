import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

// let hashPassword = await bcrypt.hashSync(password, salt); //hashSync(s:string to hash, salt length to generate  or salt to use)

//======================================Khi gửi lên đầu tiên:
//Check xem trường email có trống khống
//Nếu có kiểm tra độ dài nằm trong vùng cho phép từ 6-32 kí tự không
//Nếu có trong đó thì validate form với trường username
//$partern_user = "/^[A-Za-z0-9_\.@]{6,32}$/";
//$partten_password = "/^([A-Z]){1}([\w_\.!@#$%^&*()]+){5,31}$/";
//So sánh với user trong db

//bẮT LỖI :Bắt vào lỗi nhập với password không hợp lệ,username không hợp lệ
//Dùng chuẩn JWT(JSON Web Token)
//Ví dụ validate với chuẩn sau :
// It contains at least 8 characters and at most 20 characters : ít nhất 8 kí tự và nhiều nhất 20 kí tự
// It contains at least one digit. :Chứa 1 số
// It contains at least one upper case alphabet: 1 kí tự in hóa
// It contains at least one lower case alphabet: 1 kí tự in thường
// It contains at least one special character which includes !@#$%&*()- :1 kí tự đặc biệt
//It doesn’t contain any white space. :Không chứa khoảng trắng
//const regex = "^(?=.*[0-9]) / (?=.*[a-z]) / (?=.*[A-Z])/(?=.*[@#$%^&-+=()]) / (white space don't allow)(?=\\S+$).{8, 20}$";

//.match(regular expression); //Validate định dạng email sử dụng regex, sử dụng hàm matches()
//Dấu * biễu hiện cho sau đó là kí tự gì cũng được
//pattern_user = /^[A-Za-z0-9_\.@]{6,32}$/;
//pattern_email=/^[A-Za-z0-9_\.]{6,50}@([a-zA-Z0-9]{2,12})(.[a-zA-Z]{2,12})+$/
//   var pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
//Dấu + biễu hiện cho kí tự lập lại ít nhất 1 lần. Khi dùng dấu cộng thì trước đó phải có \
//Ví dụ: chuỗi 1+1: 1\+1
//[^0-9] : Trả về kí tự không phải là số
//\d - Chữ số bất kỳ ~ [0-9]
//\D - Ký tự bất kỳ không phải là chữ số (ngược với \d) ~ [^0-9]
//\w - Ký tự từ a-z, A-Z, hoặc 0-9 ~ [a-zA-Z0-9]
//\W - Ngược lại với \w (nghĩa là các ký tự không thuộc các khoảng: a-z, A-Z, hoặc 0-9) ~[^a-zA-Z0-9]
//\s - Khoảng trắng (space)
//\S - Ký tự bất kỳ không phải là khoảng trắng.
export let generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      admin: true,
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: "30s" }
  );
};
export let generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      admin: true,
    },
    process.env.JWT_REFRESH_TOKEN,
    { expiresIn: "1d" }
  );
};
//===========================================================Store token
// 1) Local Storage => Bị tấn công XXScript
// 2) Cookies => Bị tấn công CSRF
// 3) REDUX STORE => Lưu access_token
//HTTPONLY COOKIE => Lưu refreshToken
export let handleUserLogin = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      if (!email) {
        userData.errCode = 1;
        userData.Message = "email is required field";
        resolve(userData);
      } //================================================================================Nếu có nhập
      else {
        //========================Nếu nằm trong khoảng kí tự cho phép là 6 kí tự và tối đa 32 kí tự
        if (email.length >= 6 && email.length <= 32) {
          let pattern_email =
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
          //==============Nếu validate thành công thì ta check xem có trùng với email trong db không
          if (email.match(pattern_email)) {
            //================================================================================Nếu có email trùng thì kiểm tra password
            let user = await db.User.findOne({
              where: { email: email },
            });
            //===========================================================================================Nếu tồn tại email

            if (user) {
              //=====================================================================Kiểm tra password có trống không
              if (password) {
                let pattern_password = /^([A-Z]){1}([\w_\.!@#$%^&*()]+){5,31}$/;
                //=====================================================================Kiểm tra password có theo mẫu không
                if (password.match(pattern_password)) {
                  let check = await bcrypt.compareSync(password, user.password);
                  //=====================================================================Kiểm tra password có giống trong db không
                  if (check) {
                    //=========================================================================Redirect in here
                    userData.errCode = 0;
                    userData.Message =
                      "Password And Email is check ok and Redirect to Home in Here";
                    delete user.password;
                    userData.user = user;
                    //========================================Header/Payload/Signature <=>Header.Payload.Signature
                    // let access_token = generateAccessToken(user);
                    // let refreshToken = generateRefreshToken(user);
                    //Sau khi tạo ra token ta phải update lại token trong DB
                    // user.access_token = access_token;
                    // user.refreshToken = refreshToken;
                    // await user.save();
                    // let userAfterUpdate = await db.User.findOne({
                    //   where: { email: email },
                    // });
                    // console.log("Check user After login", userAfterUpdate);
                    // userData.access_token = access_token;
                    // userData.refresh_token = refreshToken;
                    resolve(userData);
                  } else {
                    userData.errCode = 3;
                    userData.Message = "Wrong Password";
                    resolve(userData);
                  }
                }
              } else {
                userData.errCode = 4;
                userData.Message = "Password field is Required";
                resolve(userData);
              }
            } //==============================================================================Nếu không đúng với user trong db
            else {
              userData.errCode = 4;
              userData.Message = "Email isn't exist in system";
              resolve(userData);
            }
            resolve();
          } else {
            userData.errCode = 2;
            userData.Message = "email don't match with pattern";
            resolve(userData);
          }
        } else {
          userData.errCode = 3;
          userData.Message =
            "email have minimum 1 characters uppercase and maximum 32 words";
          resolve(userData);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

//Check email có tồn tại trong hệ thống không
export let checkEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      if (email) {
        //========================Nếu nằm trong khoảng kí tự cho phép là 6 kí tự và tối đa 32 kí tự
        if (email.length >= 6 && email.length <= 32) {
          //[A-Za-z0-9_\.]{6,50}@([a-zA-Z0-9]{2,12})(.[a-zA-Z]{2,12})+
          let pattern_email =
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
          //==============Nếu validate thành công thì ta check xem có trùng với email trong db không
          if (email.match(pattern_email)) {
            //================================================================================Nếu có email trùng thì kiểm tra password
            let user = await db.User.findOne({
              where: { email: email },
            });
            //===========================================================================================Nếu tồn tại email

            if (!user) {
              return true;
            } else {
              return false;
            }
          } else {
            userData.errCode = 2;
            userData.Message = "email don't match with pattern";
            resolve(userData);
          }
        } else {
          userData.errCode = 3;
          userData.Message =
            "email have minimum 1 characters uppercase and maximum 32 words";
          resolve(userData);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export let ComparePassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
    } catch (err) {
      reject(err);
    }
  });
};

export let getAllUsers = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id !== "") {
        let users = await db.User.findOne({
          where: { id: id },
          raw: true,
          attributes: {
            exclude: ["password"],
          },
        });
        resolve(users);
      } else {
        let users = await db.User.findAll();
        resolve(users);
      }
    } catch (err) {
      reject(err);
    }
  });
};
export let HashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt); //hashSync(s:string to hash, salt length to generate  or salt to use)
      resolve(hashPassword);
    } catch (err) {
      reject(err);
    }
  });
};

//==================================================API For Create User
export let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // let email = data.email;
      const HashPasswordFromAPI = await HashUserPassword(data.password);
      let error = [];
      let email = data.email;
      let password = data.password;
      let firstName = data.firstName;
      let lastName = data.lastName;
      let address = data.address;
      let phone = data.phoneNumber;
      let gender = data.gender;
      let role = data.role;
      let position = data.position;
      let image = data.image;
      //=======================================================Check email
      if (!email) {
        error.errEmail = "email is required param";
        resolve({ errCode: 1, Message: "Email is Required field", error });
      } else {
        //Kiểm tra độ dài email
        if (email.length >= 6 && email.length <= 32) {
          let pattern_email =
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
          //Kiểm tra email viết đúng chuẩn chưa
          if (email.match(pattern_email)) {
            let user = await db.User.findOne({
              where: { email: email },
            });
            //Kiểm tra email tồn tại chưa
            if (user) {
              error.errEmail = "email Existed in system";
              resolve({
                errCode: 4,
                Message: "email existed in system",
                error,
              });
            } else {
              error.errEmail = "";
            }
          } else {
            error.errEmail = "email don't match with pattern";
            resolve({
              errCode: 3,
              Message: "email don't match with pattern",
              error,
            });
          }
        } else {
          error.errEmail =
            "email have minimum 1 characters and maximum 32 words.";
          resolve({
            errCode: 2,
            Message: "email have minimum 1 characters and maximum 32 words.",
            error,
          });
        }
      }
      //=======================================================Check email
      //=======================================================Check password
      if (!password) {
        error.errPassword = "password is required param";
        resolve({ errCode: 1, Message: "Password is Required param", error });
        // /^([A-Z]){1}([\w_\.!@#$%^&*()]+){5,31}$/
      } else {
        let pattern_password = /^([A-Z]){1}([\w_\.!@#$%^&*()]+){5,31}$/;
        //Check password theo mẫu
        if (password.match(pattern_password)) {
          //====================================================================Sau khi điền đúng pattern cho password...
          error.errPassword = "";
        } else {
          error.errPassword = "password don't match with pattern";
          resolve({
            errCode: 3,
            Message: "password don't match with pattern",
            error,
          });
        }
      }
      //=======================================================Check password
      //=======================================================Check firstName-LastName
      if (!firstName) {
        error.errFirstName = "First Name is required field";
        resolve({
          errCode: 1,
          Message: "First Name is required field",
          error,
        });
      } else {
        error.errFirstName = "";
      }
      if (!lastName) {
        error.errLastName = "Last Name is required field";
        resolve({
          errCode: 1,
          Message: "Last Name is required field",
          error,
        });
      } else {
        error.errLastName = "";
      }
      //=======================================================Check firstName-LastName
      //=======================================================Validate phone
      // 09, 03 MobiFone: 09, 07 VinaPhone: 09, 08 Vietnamobile và Gmobile: 09, 05
      if (phone) {
        let pattern_phone = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (phone.match(pattern_phone)) {
          error.errPhone = "";
        } else {
          error.errPhone = "Number Phone don't match with pattern";
          resolve({
            errCode: 1,
            Message: "Number Phone don't match with pattern",
            error,
          });
        }
      }
      //=======================================================Validate phone
      //======================================================address
      if (address) {
        error.errAddress = "";
      } else {
        error.errAddress = "Address is required field";
        resolve({
          errCode: 1,
          Message: "Address is required field",
          error,
        });
      }
      //======================================================address
      //======================================================gender
      if (gender) {
        error.errGender = "";
      } else {
        error.errGender = "gender is required field";
        resolve({
          errCode: 1,
          Message: "Address is required field",
          error,
        });
      }
      //======================================================gender
      //======================================================roleId
      if (role) {
        error.errRole = "";
      } else {
        error.errRoleId = "Role is required field";
        resolve({
          errCode: 1,
          Message: "roleId is required field",
          error,
        });
      }
      if (position) {
        error.errPosition = "";
      } else {
        error.errPosition = "Position is required field";
        resolve({
          errCode: 1,
          Message: "Position is required field",
          error,
        });
      }

      // if (image) {
      //   error.errImage = "";
      // } else {
      //   error.errImage = "Image is required field";
      //   resolve({
      //     errCode: 1,
      //     Message: "Image is required field",
      //     error,
      //   });
      // }
      //======================================================roleId
      //=======================================================Check email/password/firstName/lastName/address/phone/gender/roleId
      if (
        !error.errEmail &&
        !error.errPassword &&
        !error.errFirstName &&
        !error.errLastName &&
        !error.errPhone &&
        !error.errAddress &&
        !error.errRole &&
        !error.errGender &&
        !error.errPosition
      ) {
        let isInsertSuccess = await db.User.create({
          email: email,
          password: HashPasswordFromAPI,
          firstName: firstName,
          lastName: lastName,
          address: address,
          phoneNumber: phone,
          gender: gender,
          image: image ? image : "",
          roleId: role,
          positionId: position,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        delete data.password;
        resolve({ errCode: 0, Message: "User is Added", data: data });
      }
      //Check Password
    } catch (err) {
      reject(err);
    }
  });
};
//==================================================API For Update User
export let handleUpdateUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.position || !data.gender || data.role) {
        resolve({ errCode: 2, message: "Missing Required Param" });
      }
      let user = await db.User.findOne({ where: { id: data.id }, raw: false });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phoneNumber = data.phoneNumber;
        user.gender = data.gender;
        user.image = data.image;
        user.roleId = data.role;
        user.positionId = data.position;
        user.updatedAt = new Date();
        await user.save();
        //Sau khi cập nhật Db rồi thì ta lấy tất cả dữ liệu trong đó và trả về để render không bị lỗi
        resolve({
          errCode: 0,
          Message: "Updated users is successfully",
        });
      } else {
        resolve({
          errCode: 1,
          message: "User not Found",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};
//==================================================API For Delete User
export let handleDeleteUserFromAPI = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (id) {
        let user = await db.User.findOne({ where: { id: id } });
        if (!user) {
          // await user.destroy();
          // let newAllUser = await db.User.findAll();
          resolve({
            errCode: 1,
            Message: "Don't Find user",
          });
        }
        await user.destroy();
        resolve({ errCode: 0, Message: "Deleted user" });
      }
    } catch (err) {
      reject(err);
    }
  });
};
export let getAllCodeAPI = async (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        resolve({
          errCode: 1,
          Message: "Missing required Parameter",
        });
      } else {
        let allcode = await db.Allcode.findAll({ where: { type: type } });
        if (allcode) {
          resolve(allcode);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};
