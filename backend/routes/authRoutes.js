const express = require ('express');
const {register, login , logout, getUserDetails, editUserDetails}= require('../controllers/authController');
const upload = require("../middlewares/multer");
const authenticateUser= require('../middlewares/authMiddleware');

const router = express. Router();

router.post('/register', upload.single("photo"),register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/getUser', authenticateUser,getUserDetails);
router.put('/editUser',authenticateUser, upload.single("photo"), editUserDetails);

module.exports = router;