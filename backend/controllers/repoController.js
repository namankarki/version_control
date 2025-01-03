const Repository = require('../models/Repository');
const Branch = require('../models/Branch');

exports.createRepository = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const repo = await Repository.create({ name, UserId: userId });
        await Branch.create({ name: 'main', RepositoryId: repo.id });

        res.status(201).json({ message: 'Repository created', repo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRepositories = async (req, res) => {
    try {
        const userId = req.user.id; // Logged-in user's ID

        // Retrieve repositories belonging to the logged-in user
        const repositories = await Repository.findAll({ where: { UserId: userId } });

        res.status(200).json({ repositories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRepository = async (req, res) => {
    try {
        const { id } = req.params; // Repository ID from the route
        const userId = req.user.id; // Logged-in user's ID
        const { name, defaultBranch } = req.body; // Fields to update

        // Find the repository and ensure it belongs to the logged-in user
        const repository = await Repository.findOne({ where: { id, UserId: userId } });

        if (!repository) {
            return res.status(404).json({ error: 'Repository not found or not authorized' });
        }

        // Update the repository fields if provided
        if (name) repository.name = name;
        if (defaultBranch) repository.defaultBranch = defaultBranch;

        await repository.save();

        res.status(200).json({ message: 'Repository updated successfully', repository });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRepository = async (req, res) => {
    try {
        const { id } = req.params; // Repository ID from the route
        const userId = req.user.id; // Logged-in user's ID

        // Find the repository and ensure it belongs to the logged-in user
        const repository = await Repository.findOne({ where: { id, UserId: userId } });

        if (!repository) {
            return res.status(404).json({ error: 'Repository not found or not authorized' });
        }

        // Delete the repository
        await repository.destroy();

        res.status(200).json({ message: 'Repository deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};