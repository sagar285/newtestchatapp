const { userlogin, usergetallphonenumbers, updateusername, getuserbyid } = require("../controllers/user");
const verifyToken = require("../middleware/auth");

const router = require("express").Router()


router.post("/userlogin",userlogin);
router.post("/getuserbyid",verifyToken,getuserbyid);
router.post("/usergetallphonenumbers",verifyToken,usergetallphonenumbers);
router.put("/username",verifyToken,updateusername)

module.exports =router