const { body } = require("express-validator");

exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),

body("phone")
  .trim()
  .notEmpty().withMessage("Phone is required")
  .isLength({ min: 10, max: 10 }).withMessage("Phone must be exactly 10 digits")
  .isNumeric().withMessage("Phone must contain only numbers"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

exports.loginValidation = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("password")
  .trim()
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")

];
