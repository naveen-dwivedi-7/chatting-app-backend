const Conversation = require("../models/conversation");

const conversationController = {

  // List conversations
  list: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const { rows: conversations, total } = await Conversation.getAllPaginated(limit, offset);

      conversations.forEach(c => {
        c.displayType = c.type == 1 ? '1-1' : 'Group';
      });

      res.render("conversations/index", { 
        conversations, 
        currentPage: page, 
        totalPages: Math.ceil(total / limit) 
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // Show create form
  showAddForm: async (req, res) => {
    try {
      const users = await Conversation.getAllUsers();
      res.render("conversations/create", { users });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // Create conversation
  add: async (req, res) => {
    try {
      const { title, type, created_by } = req.body;
      if (!title || !type || !created_by) return res.status(400).send("All fields required");

      await Conversation.create({
        title,
        type: parseInt(type),
        created_by: parseInt(created_by)
      });
      res.redirect("/conversations");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // Show edit form
  editForm: async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.params.id);
      if (!conversation) return res.status(404).send("Conversation not found");

      const users = await Conversation.getAllUsers();
      res.render("conversations/edit", { conversation, users });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // Update conversation
  update: async (req, res) => {
  try {
    const { title, type, created_by } = req.body;

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).send("Conversation not found");

    await Conversation.updateById(req.params.id, {
      title,
      type: parseInt(type),          // convert type to integer
      created_by: parseInt(created_by) // convert created_by to integer
    });

    res.redirect("/conversations");
  } catch (err) {
    console.error("Error updating conversation:", err);
    res.status(500).send("Error updating conversation");
  }
},


  // Delete conversation
delete: async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Deleting conversation ID:", id);

    // Check if conversation exists
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      console.log("Conversation not found in DB");
      return res.status(404).send("Conversation not found");
    }
    console.log("Conversation found:", conversation);

    // Delete from DB
    const result = await Conversation.deleteById(id);
    console.log("Delete result:", result);

    // Redirect back to list
    res.redirect("/conversations");
  } catch (err) {
    console.error("Error deleting conversation:", err);
    res.status(500).send("Error deleting conversation");
  }
}



};

module.exports = conversationController;
