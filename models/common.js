const db = require("../config/db");

const Common = {
  getUsers: async () => {
    const [rows] = await db.query("SELECT id, name FROM users ORDER BY name ASC");
    return rows;
  },

  getConversations: async () => {
    const [rows] = await db.query("SELECT id, title FROM conversations ORDER BY title ASC");
    return rows;
  },
};

module.exports = Common;
