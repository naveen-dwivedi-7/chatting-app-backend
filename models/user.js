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

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );
    return rows[0]; // return single user
  },

  // Update user by ID
  updateById: async (id, data) => {
    const { name, email, phone, password, profile_image } = data;

    const [result] = await db.query(
      `UPDATE users 
       SET name = ?, email = ?, phone = ?, password = ?, profile_image = ?
       WHERE id = ?`,
      [name, email, phone, password, profile_image, id]
    );

    return result;
  },

  existsWithEmail: async (email, excludeId = null) => {
    let query = "SELECT id FROM users WHERE email = ?";
    let params = [email];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0; // true if exists
  },

  // Check if phone exists for another user
  existsWithPhone: async (phone, excludeId = null) => {
    let query = "SELECT id FROM users WHERE phone = ?";
    let params = [phone];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await db.query(query, params);
    return rows.length > 0; // true if exists
  },

  
  deleteById: async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result;
},

getAll: async () => {
    const [rows] = await db.query("SELECT id, name FROM users");
    return rows;
  },

};

module.exports = User;
