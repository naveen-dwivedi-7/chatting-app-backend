const db = require("../config/db");

const User = {
  // Get paginated users
getAllPaginated: async (limit, offset) => {
    const [rows] = await db.query("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
    const [countResult] = await db.query("SELECT COUNT(*) as count FROM users");
    const total = countResult[0].count;
    return { rows, total }; // rows must be an array
  },

  // Count total users
  countUsers: async () => {
    const [rows] = await db.query(`SELECT COUNT(*) AS count FROM users`);
    return rows[0].count;
  },

  // Create user
  create: async (data) => {
    const [result] = await db.query(
      `INSERT INTO users (name, email, phone, password, profile_image) VALUES (?, ?, ?, ?, ?)`,
      [data.name, data.email, data.phone, data.password, data.profile_image]
    );
    return result;
  },

  // Find user by email or phone
  findByEmailOrPhone: async (email, phone) => {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE email = ? OR phone = ?`,
      [email, phone]
    );
    return rows;
  },

  // ✅ Converted to async/await
  findByEmail: async (email) => {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows;
  },
};

module.exports = User;
