const MessageModel = require('../modals/messages');
const ChatModel = require('../modals/chats');
const { uploadFile } = require('../middleware/S3');
const crypto =require("crypto")

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

const sendMessage = async (req, res) => {
    let image;
    const { chatId, text,receiverId, type,time } = req.body
    console.log(req.file)
    const imageFile = req.files['image']?.[0];
    const Types = imageFile?.mimetype ? imageFile?.mimetype :null


    const imgname = imageFile ? generateFileName() :null
    console.log(imageFile)
    if(imageFile && imageFile?.buffer && imageFile?.mimetype){
        await uploadFile(imageFile?.buffer, imgname, imageFile.mimetype);
    }   
     
       image = imgname ?  "https://d3bjtrjgvxo65.cloudfront.net/" +imgname  : null
    try {
        const newMessage = await MessageModel.create({
            text,
            chatId,
            time,
            image:image,
            type:Types,
            user: req.user._id
        })
        const chatUpdate = await ChatModel.findByIdAndUpdate(chatId, {
            latestMessage: text
        }, {
            new: true
        }).populate({
            path:"users",
            select:"userName"
        })
        // console.log("updated chat",chatUpdate)
        res.send({
            data: newMessage,
            roomData: chatUpdate,
            status: true,

        })
    } catch (error) {
        console.log(error)
        res.status(403).json({ status: false, error: error })
    }
}


const myMessages = async (req, res) => {
    const chatId = req.body.chatId
    const page = parseInt(req.query.pag3) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit 
    try {
        const messages = await MessageModel.find({
            chatId: chatId
        }).populate({
            path: "user",
            select:"userName"
        }).sort({createdAt: -1})
        res.send({
            data: messages,
            status: true,
        })
    } catch (error) {
        res.status(403).json({ status: false, error: error })
    }
}


module.exports = {
    sendMessage,
    myMessages
}