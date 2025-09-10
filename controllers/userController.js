const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userController = {
  listUsers: async (req, res) => {
    try {
      const token = req.query.token || req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).send("Authorization token required");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
        user: decoded,
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(401).send("Invalid or expired token");
    }
  },
};

module.exports = userController;
