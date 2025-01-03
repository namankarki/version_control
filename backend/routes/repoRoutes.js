const express = require('express');
const {
    createRepository,
    getRepositories,
    updateRepository,
    deleteRepository,
} = require('../controllers/repoController');
const authenticateUser = require('../middlewares/authMiddleware');

const router = express.Router();

// Route to create a new repository
router.post('/', authenticateUser, createRepository);

// Route to get all repositories for the logged-in user
router.get('/', authenticateUser, getRepositories);

// Route to update a repository by ID
router.put('/:id', authenticateUser, updateRepository);

// Route to delete a repository by ID
router.delete('/:id', authenticateUser, deleteRepository);

module.exports = router;
