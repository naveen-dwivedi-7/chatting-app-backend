// models/user.js
const db = require("../config/db");

const User = {
  // get all users
 getAllUsers: async (page, limit) => {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
      "SELECT * FROM users LIMIT ? OFFSET ?",
      [limit, offset]
    );

    // get total count
    const [countResult] = await db.query("SELECT COUNT(*) as count FROM users");
    const total = countResult[0].count;

    return { rows, total };
  },

  // get user by ID
  getUserById: async (id) => {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0]; // return single user
  },

  // create user
  createUser: async ({ name, email, phone, password }) => {
    console.log(`name :${name}`);
    console.log(`email :${email}`);
    try {
      const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
      const [result] = await db.query(sql, [name, email, phone, password]);
      return result; // contains insertId
    } catch (err) {
      console.error("Error in createUser:", err);
      throw err; // propagate error to controller
    }
  },


  // check if email already present or not
  isEmailPresent: async (email) => {
    try {
      const [rows] = await db.query(
        "SELECT email FROM users WHERE email = ?",
        [email]
      );
      console.log("DEBUG rows:", rows); // see what comes back
      return rows.length > 0;
    } catch (err) {
      console.error("Error in isEmailPresent:", err);
      throw err; // rethrow to catch in controller
    }
  },


  // check if phone already present or not
  isPhonePresent: async (phone) => {
    const [rows] = await db.query(
      "SELECT phone FROM users WHERE phone = ?",
      [phone]
    );
    return rows.length > 0; // ✅ returns true if email exists // rows will be [] if no email found
  },

  // Check if email exists for other users
  isEmailPresentForUpdate: async (email, userId) => {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );
    return rows.length > 0; // true if email exists for someone else
  },

  // Check if phone exists for other users
  isPhonePresentForUpdate: async (phone, userId) => {
    const [rows] = await db.query(
      "SELECT id FROM users WHERE phone = ? AND id != ?",
      [phone, userId]
    );
    return rows.length > 0; // true if phone exists for someone else
  },


  // Get user detail by email
  getUserDetailByEmail: async (email) => {
    const [rows] = await db.query(
      "SELECT id, name, email, phone, password FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    return rows.length > 0 ? rows[0] : null; // return the first row or null
  },

  // ✅ Update user
  async updateUser(id, { name, email, phone }) {
    const [result] = await db.query(
      "UPDATE users SET name = ?, email = ?, phone=?  WHERE id = ?",
      [name, email, phone, id]
    );
    return result.affectedRows;
  },

  // ✅ Delete user
  async deleteUser(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
  }

};

module.exports = User;
