const { body } = require("express-validator");

const emailRule = body("email").isEmail().withMessage("Email không hợp lệ");
const passwordRule = body("password").isLength({ min: 6 }).withMessage("Mật khẩu tối thiểu 6 ký tự");

exports.registerRules = [
  body("name").trim().notEmpty().withMessage("Vui lòng nhập tên"),
  emailRule,
  passwordRule,
];

exports.loginRules = [emailRule, passwordRule];
