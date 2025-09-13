const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const userController = {

  showAddForm: (req, res) => {
    res.render("users/create", { title: "Add User" });
  },

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
        currentPage: page,  // ✅ send as currentPage
        totalPages,
        user: null,
        token: null,
      });

    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong"); // not 401
    }
  },
  add: async (req, res) => {
    console.log("inside add user form");
    try {
      const { name, email, phone, password } = req.body;
      const profile_image = req.file ? req.file.filename : null;

      if (!name || !email || !phone || !password) {
        console.log("Missing required fields:", req.body);
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      // Check if email or phone exists
      const existingUsers = await User.findByEmailOrPhone(email, phone);
      if (existingUsers.length > 0) {
        console.log("User already exists:", existingUsers);
        return res.status(400).json({ success: false, message: "Email or Phone already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save to DB
      const result = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        profile_image,
      });

      console.log("User added successfully:", result);

      // ✅ Send JSON response for AJAX
      res.status(201).json({ success: true, message: "User added successfully", user: result });

    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
  editForm: async (req, res) => {
    console.log("Inside Edit Form")
    try {
      const user = await User.findById(req.params.id); // replace with your query
      res.render("users/edit", { user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error loading edit form");
    }
  },

  update: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // 🔹 Check duplicates
      if (await User.existsWithEmail(email, req.params.id)) {
        return res.status(400).json({ message: "⚠️ This email already exists in the database" });
      }
      if (await User.existsWithPhone(phone, req.params.id)) {
        return res.status(400).json({ message: "⚠️ This phone number already exists in the database" });
      }

      // 🔹 Password (keep old if not changed)
      let hashedPassword = user.password;
      if (password && password.trim() !== "") {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      // 🔹 Profile image
      console.log(`user profile: ${user.profile_image}`)

      let profileImage = user.profile_image;
      if (req.file) {
        if (user.profile_image) {
          const oldPath = path.join(__dirname, "../public/uploads", user.profile_image);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        profileImage = req.file.filename;
      }
      console.log(`profileImage: ${profileImage}`)
      // 🔹 Update in DB
      await User.updateById(req.params.id, {
        name,
        email,
        phone,
        password: hashedPassword,
        profile_image: profileImage
      });

      return res.json({ message: "✅ User updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "❌ Error updating user" });
    }
  },

  delete: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Delete profile image if exists
      if (user.profile_image) {
        const imagePath = path.join(__dirname, "../public/uploads", user.profile_image);
        try {
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }

      // Delete user from DB
      await User.deleteById(req.params.id);

      return res.json({ message: "✅ User deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "❌ Error deleting user" });
    }
  }
}
module.exports = userController;
