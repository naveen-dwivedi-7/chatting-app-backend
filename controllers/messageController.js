const Common = require("../models/common");
const Message = require("../models/message");


const messageController = {
  index: async (req, res) => {
    const messages = await Message.getAll();
    res.render("messages/index", { messages });
  },

  new: async (req, res) => {
    const users = await Common.getUsers();
    const conversations = await Common.getConversations();
    res.render("messages/create", { users, conversations });
  },

  create: async (req, res) => {
    const { conversation_id, sender_id, message } = req.body;
    await Message.create(conversation_id, sender_id, message);
    res.redirect("/messages");
  },

  edit: async (req, res) => {
    const message = await Message.getById(req.params.id);
    const users = await Common.getUsers();
    const conversations = await Common.getConversations();
    res.render("messages/edit", { message, users, conversations });
  },

  update: async (req, res) => {
    const { message, is_read } = req.body;
    await Message.update(req.params.id, message, is_read);
    res.redirect("/messages");
  },

  delete: async (req, res) => {
    await Message.delete(req.params.id);
    res.redirect("/messages");
  },
};



module.exports = messageController;
