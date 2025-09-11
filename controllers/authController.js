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
      const email = req.body?.email;
      const password = req.body?.password;
      if (!email || !password) return res.status(400).json({ error: "Email & password required" });

      const results = await User.findByEmail(email);
      if (!results || results.length === 0) return res.status(404).json({ error: "User not found" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

      const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      });
      // Store token in HTTP-only cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: "Lax",
        domain: "localhost", // ✅ explicitly set domain
        secure: false // set true if using HTTPS
      });

      return res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      console.error("❌ Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },


  logout: (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
  },


};

module.exports = authController;
