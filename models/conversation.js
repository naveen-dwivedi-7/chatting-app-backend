const db = require("../config/db");

const Conversation = {

  getAllPaginated: async (limit, offset) => {
    const [rows] = await db.query(
      `SELECT c.id, c.title, c.type, c.created_by, u.name AS created_by_name
       FROM conversations c
       LEFT JOIN users u ON c.created_by = u.id
       ORDER BY c.updated_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const [countResult] = await db.query("SELECT COUNT(*) as count FROM conversations");
    return { rows, total: countResult[0].count };
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT * FROM conversations WHERE id = ?", [id]);
    return rows[0];
  },

  create: async ({ title, type, created_by }) => {
    const [result] = await db.query(
      "INSERT INTO conversations (title, type, created_by) VALUES (?, ?, ?)",
      [title, type, created_by]
    );
    return result;
  },

 updateById: async (id, { title, type, created_by }) => {
  const [result] = await db.query(
    `UPDATE conversations
     SET title = ?, type = ?, created_by = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [title, type, created_by, id]
  );
  return result;
},


  deleteById: async (id) => {
  const [result] = await db.query("DELETE FROM conversations WHERE id = ?", [id]);
  return result;
},

  getAllUsers: async () => {
    const [rows] = await db.query("SELECT id, name FROM users");
    return rows;
  }

};

module.exports = Conversation;
