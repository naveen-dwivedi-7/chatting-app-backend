const Common = require("../models/common");
const Message = require("../models/message");

const messageController = {
  index: async (req, res) => {
    try {
      const messages = await Message.getAll();
      res.render("messages/index", { messages });
    } catch (err) {
      console.error("Error loading messages:", err);
      res.status(500).send("Server error");
    }
  },

  new: async (req, res) => {
    try {
      const users = await Common.getUsers();
      const conversations = await Common.getConversations();
      res.render("messages/create", { users, conversations });
    } catch (err) {
      console.error("Error loading create form:", err);
      res.status(500).send("Server error");
    }
  },

  create: async (req, res) => {
    try {
      console.log("Create req.body:", req.body);
      const { conversation_id, sender_id, message, is_read } = req.body;

      if (!conversation_id || !sender_id || !message) {
        return res.status(400).send("conversation, sender and message are required");
      }

      await Message.create(
        parseInt(conversation_id),
        parseInt(sender_id),
        message,
        is_read ? 1 : 0
      );

      res.redirect("/messages");
    } catch (err) {
      console.error("Error creating message:", err);
      res.status(500).send("Server error");
    }
  },

  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const message = await Message.getById(id);
      if (!message) return res.status(404).send("Message not found");

      const users = await Common.getUsers();
      const conversations = await Common.getConversations();
      res.render("messages/edit", { message, users, conversations });
    } catch (err) {
      console.error("Error loading edit form:", err);
      res.status(500).send("Server error");
    }
  },

  update: async (req, res) => {
    try {
      console.log("Update req.body:", req.body);
      const id = req.params.id;
      const { conversation_id, sender_id, message, is_read } = req.body;

      if (!message) return res.status(400).send("Message text is required");

      await Message.update(
        id,
        parseInt(conversation_id),
        parseInt(sender_id),
        message,
        is_read ? 1 : 0
      );

      res.redirect("/messages");
    } catch (err) {
      console.error("Error updating message:", err);
      res.status(500).send("Server error");
    }
  },

  delete: async (req, res) => {
    try {
      const id = req.params.id;
      console.log("Deleting message id:", id);

      const msg = await Message.getById(id);
      if (!msg) return res.status(404).send("Message not found");

      await Message.delete(id);
      res.redirect("/messages");
    } catch (err) {
      console.error("Error deleting message:", err);
      res.status(500).send("Server error");
    }
  },
};

module.exports = messageController;
