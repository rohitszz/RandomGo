const router = require('express').Router();
const User = require('../models/user');

const {login} = require('../controllers/login');
const {signupToken, sendOtp, verifyOtp} = require('../controllers/signup'); 
const {authcheck, logout} = require("../controllers/auth");
const {userprofile, userprofilebyid} = require('../controllers/userprofile');
const { messages, getMessages } = require('../controllers/messages');  
const  upload = require("../middlewares/upload")
const { imageUpload } = require("../controllers/imageupload")
const { deleteAccount} = require("../controllers/deleteacc")
const { markSeen } = require("../controllers/markseen")

router.post('/login', login);
router.post('/signuptoken', signupToken);
router.post('/signup/sendotp', sendOtp);
router.post('/signup/verifyotp', verifyOtp);
router.get('/authVerify', authcheck);
router.post('/dashboard/logout', logout);
router.get('/dashboard', userprofile);
router.post('/messages', messages); 
router.post('/messages/getmessages', getMessages);   
router.post('/userprofilebyid', userprofilebyid);   
router.post('/upload-image', upload.single("image"), imageUpload);
router.post('/deleteaccount', deleteAccount);
router.post('/markseen', markSeen);

module.exports = router;
     