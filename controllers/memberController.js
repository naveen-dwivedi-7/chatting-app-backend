const Member = require("../models/member");
const Common = require("../models/common");

const memberController = {
  index: async (req, res) => {
    const members = await Member.getAll();
    res.render("members/index", { members });
  },

  new: async (req, res) => {
    const users = await Common.getUsers();
    const conversations = await Common.getConversations();
    res.render("members/create", { users, conversations });
  },

  create: async (req, res) => {
    const { conversation_id, user_id } = req.body;
    await Member.create(conversation_id, user_id);
    res.redirect("/members");
  },

  edit: async (req, res) => {
    const member = await Member.getById(req.params.id);
    const users = await Common.getUsers();
    const conversations = await Common.getConversations();
    res.render("members/edit", { member, users, conversations });
  },

  update: async (req, res) => {
    const { conversation_id, user_id } = req.body;
    await Member.update(req.params.id, conversation_id, user_id);
    res.redirect("/members");
  },

  delete: async (req, res) => {
    await Member.delete(req.params.id);
    res.redirect("/members");
  },
};

module.exports = memberController;

