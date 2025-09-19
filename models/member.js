const db = require("../config/db");

const Member = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT cm.*, u.name AS user_name, c.title AS conversation_title
       FROM conversation_members cm
       LEFT JOIN users u ON cm.user_id = u.id
       LEFT JOIN conversations c ON cm.conversation_id = c.id
       ORDER BY cm.joined_at DESC`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM conversation_members WHERE id=?", [id]);
    return rows[0];
  },

  create: async (conversation_id, user_id) => {
    return db.query(
      "INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)",
      [conversation_id, user_id]
    );
  },

  update: async (id, conversation_id, user_id) => {
    return db.query(
      "UPDATE conversation_members SET conversation_id=?, user_id=? WHERE id=?",
      [conversation_id, user_id, id]
    );
  },

  delete: async (id) => {
    return db.query("DELETE FROM conversation_members WHERE id=?", [id]);
  },
};

module.exports = Member;
