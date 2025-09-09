const User = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
require('dotenv').config();

const authController = {
    // get all users
    async getAllUsers(req, res) {
        try {
            const users = await User.getAllUsers();
            return res.json(users); // send as JSON
        } catch (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    async getUser(req, res) {
        try {
            const { id } = req.params;   // <-- from URL
            const user = await User.getUserById(id);
            return res.json(user); // send as JSON
        } catch (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    async createUser(req, res) {
        console.log('req.body contains')
        console.log(req.body)
        console.log('i am inside create user controller')
        try {
            const { name, email, phone, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("req.body:", JSON.stringify(req.body));
            console.log('i am create user controller try block')
            console.log(`name ${req.body.name}`)
            if (!name || !email || !phone || !password) {
                return res.status(400).json({ error: "All fields are required" });
            }
            // check email
            const emailExists = await User.isEmailPresent(email);
            if (emailExists.length > 0) {
                return res.status(400).json({ error: "Email already exists" });
            }

            // check phone
            const phoneExists = await User.isPhonePresent(phone);
            if (phoneExists) {
                return res.status(400).json({ error: "Phone already exists" });
            }
            // console.log("Name:", name);
            // console.log("Email:", email);
            // console.log("Phone:", phone);
            // console.log("Password:", password);

            console.log(`phone exist: ${phoneExists}`)
            const user = await User.createUser({
                name,
                email,
                phone,
                password: hashedPassword
            });
            return res.status(201).json(user);
        } catch (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Internal server error1" });
        }
    },

    async login(req, res) {

        try {
            const { email, password } = req.body;
            console.log(req.body)
            const user = await User.getUserDetailByEmail(email)
            console.log(user)
            if (!user) {
                return res.status(400).json({ error: "User Not Found" });
            }
            // check email
            const isEmailPresent = await User.isEmailPresent(email);
            if (!isEmailPresent) {
                return res.status(400).json({ error: "User Not Found" });
            }
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Credentials" });
            }
            const token = jwt.sign({
                data: { id: user.id, email: user.email, phone: user.phone }
            }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
            // localStorage.setItem('token',token)
            res.json({ token })
        } catch (err) {
            console.error("Error creating user:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    async logout(req, res) {
        try {
            // If using JWT, logout = tell frontend to delete token
            // Or clear cookie if token is stored in cookies
            // localStorage.removeItem(token)
            res.json({ message: "Logged out successfully, please clear token on client-side." });
        } catch (err) {
            console.error("Error logging out:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    showLogin: (req, res) => res.render("auth/login", { title: "Login" }),

    showRegister: (req, res) => res.render("auth/register", { title: "Register" }),

    async listUsers(req, res) {
        const users = await User.getAll();
        res.render("users", { title: "Users List", users });
    },

};

module.exports = authController;
