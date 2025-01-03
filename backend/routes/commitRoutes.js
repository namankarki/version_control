const express = require('express');

const {createCommit,
        getCommit,

}= require("../controllers/commitController");

const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, createCommit);
router.get('/', authenticateUser, getCommit);

module.exports=router;