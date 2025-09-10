const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const authController = {
  showRegister: (req, res) => {
    res.render("auth/register", { title: "Register" });
  },

  register: async (req, res) => {
    console.log("inside register");
    try {
      const { name, email, phone, password } = req.body;
      const profile_image = req.file ? req.file.filename : null;

      if (!name || !email || !phone || !password) {
        console.log("Missing required fields:", req.body);
        return res.status(400).send("All fields are required");
      }

      // Check if email or phone exists
      const existingUsers = await User.findByEmailOrPhone(email, phone);
      if (existingUsers.length > 0) {
        console.log("User already exists:", existingUsers);
        return res.status(400).send("Email or Phone already registered");
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

      console.log("User created successfully:", result);

      // Redirect to login
      res.redirect("/api/auth/login");
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).send("Internal server error");
    }
  },
   showLogin: (req, res) => {
    res.render("auth/login", { title: "Login" });
  },

 login: async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await User.findByEmailOrPhone(email, email);
    if (!users || users.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = users[0];
    console.log(`user:${user}`)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // ✅ Send JSON response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

};

module.exports = authController;
