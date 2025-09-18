const db = require("../config/db");

const Conversation = {
  // ✅ Get paginated conversations
  getAllPaginated: async (limit, offset) => {
    const [rows] = await db.query(
      "SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    const [countResult] = await db.query("SELECT COUNT(*) as count FROM conversations");
    const total = countResult[0].count;
    return { rows, total }; // rows must be an array
  },

  // ✅ Count conversations
  countConversations: async () => {
    const [rows] = await db.query("SELECT COUNT(*) AS count FROM conversations");
    return rows[0].count;
  },

  // ✅ Create a new conversation
  create: async (data) => {
    console.log(`data :${data}`)
    const [result] = await db.query(
      `INSERT INTO conversations (title, type, created_by) VALUES (?, ?, ?)`,
      [data.title, data.type, data.created_by]
    );
    return result;
  },

  // ✅ Find conversation by ID
  findById: async (id) => {
    const [rows] = await db.query(
      "SELECT * FROM conversations WHERE id = ?",
      [id]
    );
    return rows[0]; // single conversation
  },

  // ✅ Update conversation by ID
  updateById: async (id, data) => {
    const { title, type } = data;

    const [result] = await db.query(
      `UPDATE conversations 
       SET title = ?, type = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, type, id]
    );

    return result;
  },

  // ✅ Delete conversation
  deleteById: async (id) => {
    const [result] = await db.query(
      "DELETE FROM conversations WHERE id = ?",
      [id]
    );
    return result;
  },
   getAll: async () => {
    const [rows] = await db.query("SELECT id, name FROM users");
    return rows;
  },
};

module.exports = Conversation;
