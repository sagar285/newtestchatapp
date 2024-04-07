const { createPrivateChat, myChats, createGroupChat, chatById } = require("../controllers/chats");
const verifyToken = require("../middleware/auth");

const router = require("express").Router()


router.post("/createChat",verifyToken,createPrivateChat);
router.get("/mychats",verifyToken,myChats);
router.post("/groupChat",verifyToken,createGroupChat);
router.post("/Chatbyid",verifyToken,chatById);

module.exports =router