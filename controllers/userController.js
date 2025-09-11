const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userController = {
  listUsers: async (req, res) => { 
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const { rows, total } = await User.getAllPaginated(limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.render("users/index", {
      title: "Users List",
      users: rows,
      page,
      totalPages,
      user: null,  // no decoded user
      token: null, // no token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong"); // not 401
  }
},

};

module.exports = userController;
