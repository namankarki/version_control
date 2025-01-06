const express = require('express');

const {createCommit,
        getCommitDetails,

}= require("../controllers/commitController");

const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, createCommit);
router.get('/:id', authenticateUser, getCommitDetails);

module.exports=router;