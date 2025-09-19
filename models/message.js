const db = require("../config/db");

const Message = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT m.*, u.name AS sender_name, c.title AS conversation_title
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       LEFT JOIN conversations c ON m.conversation_id = c.id
       ORDER BY m.created_at DESC`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM messages WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (conversation_id, sender_id, message, is_read = 0) => {
    const [result] = await db.query(
      "INSERT INTO messages (conversation_id, sender_id, message, is_read, created_at) VALUES (?, ?, ?, ?, NOW())",
      [conversation_id, sender_id, message, is_read]
    );
    return result;
  },

  update: async (id, conversation_id, sender_id, message, is_read = 0) => {
    const [result] = await db.query(
      `UPDATE messages
       SET conversation_id = ?, sender_id = ?, message = ?, is_read = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [conversation_id, sender_id, message, is_read, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM messages WHERE id = ?", [id]);
    return result;
  },
};

module.exports = Message;
