const User = require("../models/user");

const userController = {
    // Show all users in list.ejs
    async list(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;  // current page
            const limit = 5; // records per page

            const { rows: users, total } = await User.getAllUsers(page, limit);

            const totalPages = Math.ceil(total / limit);

            res.render("users/index", {
                users,
                currentPage: page,
                totalPages
            });
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).send("Internal Server Error");
        }
    },


    // Show add user form
    async showAddForm(req, res) {
        res.render("users/add"); // users/add.ejs
    },

    // Handle add user form submission
    // async add(req, res) {
    //     try {
    //         const { name, email,phone, password } = req.body;
    //         await User.createUser({ name, email,phone, password });
    //         res.redirect("/api/auth/users/list");
    //     } catch (err) {
    //         console.error("Error adding user:", err);
    //         res.status(500).send("Internal Server Error");
    //     }
    // },
    // controllers/userController.js

    async add(req, res) {
        try {
            const { name, email, phone, password } = req.body;

            // Check if email already exists
            const existingEmail = await User.isEmailPresent(email);
            if (existingEmail) {
                return res.status(400).json({ error: "❌ Email already exists!" });
            }

            // Check if phone already exists
            const existingPhone = await User.isPhonePresent(phone);
            if (existingPhone) {
                return res.status(400).json({ error: "❌ Phone already exists!" });
            }

            // Insert into DB
            const newUser = await User.createUser({ name, email, phone, password });

            // ✅ Return JSON instead of redirect
            return res.status(201).json({
                message: "✅ User added successfully!",
                user: newUser,
            });
        } catch (err) {
            console.error("Error adding user:", err);
            return res.status(500).json({ error: "⚠️ Internal Server Error" });
        }
    },




    // Show edit form
    async showEditForm(req, res) {
        try {
            const id = req.params.id;
            const user = await User.getUserById(id);
            if (!user) {
                return res.status(404).send("User not found");
            }
            res.render("users/edit", { user }); // users/edit.ejs
        } catch (err) {
            console.error("Error fetching user:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    // Handle edit user form submission
    // async update(req, res) {
    //     try {
    //         const id = req.params.id;
    //         const { name, email, phone } = req.body;
    //         await User.updateUser(id, { name, email, phone });
    //         res.redirect("/api/auth/users/list");
    //     } catch (err) {
    //         console.error("Error updating user:", err);
    //         res.status(500).send("Internal Server Error");
    //     }
    // },

    async update(req, res) {
        try {
            const id = req.params.id;
            const { name, email, phone } = req.body;
            console.log(`req.body:'${req.body}`)

            if (!id || !name || !email || !phone) {
                return res.status(400).json({ error: "⚠️ All fields are required" });
            }

            // Check email for other users
            const emailExists = await User.isEmailPresentForUpdate(email, id);
            if (emailExists) {
                return res.status(400).json({ error: "❌ Email already exists for another user!" });
            }

            // Check phone for other users
            const phoneExists = await User.isPhonePresentForUpdate(phone, id);
            if (phoneExists) {
                return res.status(400).json({ error: "❌ Phone already exists for another user!" });
            }

            // Update if no conflicts
            await User.updateUser(id, { name, email, phone });
            return res.json({ message: "✅ User updated successfully" });

        } catch (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ error: "⚠️ Internal Server Error" });
        }
    },



    // Delete user
    // controllers/authController.js
    async delete(req, res) {
        try {
            const id = req.params.id;
            console.log(`id: ${id}`)
            await User.deleteUser(id);
            res.json({ message: "User deleted successfully" });
        } catch (err) {
            console.error("Error deleting user:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

};

module.exports = userController;
