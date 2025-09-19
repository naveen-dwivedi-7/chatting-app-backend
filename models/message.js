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
    const [rows] = await db.query("SELECT * FROM messages WHERE id=?", [id]);
    return rows[0];
  },

  create: async (conversation_id, sender_id, message) => {
    return db.query(
      "INSERT INTO messages (conversation_id, sender_id, message) VALUES (?,?,?)",
      [conversation_id, sender_id, message]
    );
  },

  update: async (id, message, is_read) => {
    return db.query(
      "UPDATE messages SET message=?, is_read=? WHERE id=?",
      [message, is_read, id]
    );
  },

  delete: async (id) => {
    return db.query("DELETE FROM messages WHERE id=?", [id]);
  },
};

module.exports = Message;