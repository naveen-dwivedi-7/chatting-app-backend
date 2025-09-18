const Conversation = require("../models/conversation");
const User = require("../models/user");

const conversationController = {
  // ✅ Show Add Form
  showAddForm: async (req, res) => {
    try {
      const users = await User.getAll(); // fetch all users
      res.render("conversations/create", { 
        title: "Add Conversation", 
        users 
      });
    } catch (err) {
      console.error("Error loading create form:", err);
      res.status(500).send("Error loading create form");
    }
  },

  // ✅ List Conversations (Paginated)
  list: async (req, res) => {
    try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { rows: conversations, total } = await Conversation.getAllPaginated(limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.render('conversations/index', {
      conversations,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
  },

  // ✅ Add Conversation
  add: async (req, res) => {
    try {
      const { title, type, created_by } = req.body;

      if (!title || !type || !created_by) {
        return res.status(400).send("All fields are required");
      }

      await Conversation.create({ title, type, created_by });

      // 🔄 Redirect to list page after success
      res.redirect("/conversations");
    } catch (err) {
      console.error("Error creating conversation:", err);
      res.status(500).send("Internal server error");
    }
  },

   // ✅ Show Edit Form with Users Dropdown
  editForm: async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.params.id);
      if (!conversation) {
        return res.status(404).send("Conversation not found");
      }

      const users = await User.getAll(); // fetch all users

      res.render("conversations/edit", { 
        title: "Edit Conversation", 
        conversation, 
        users 
      });
    } catch (err) {
      console.error("Error loading edit form:", err);
      res.status(500).send("Error loading edit form");
    }
  },
  // ✅ Update Conversation
  update: async (req, res) => {
    try {
      const { title, type } = req.body;
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return res.status(404).send("Conversation not found");
      }

      await Conversation.updateById(req.params.id, { title, type });

      // 🔄 Redirect after success
      res.redirect("/conversations");
    } catch (err) {
      console.error("Error updating conversation:", err);
      res.status(500).send("Error updating conversation");
    }
  },

  // ✅ Delete Conversation
  delete: async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.params.id);

      if (!conversation) {
        return res.status(404).send("Conversation not found");
      }

      await Conversation.deleteById(req.params.id);

      // 🔄 Redirect after success
      res.redirect("/conversations");
    } catch (err) {
      console.error("Error deleting conversation:", err);
      res.status(500).send("Error deleting conversation");
    }
  },
};

module.exports = conversationController;
