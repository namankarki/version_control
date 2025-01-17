const Commit = require('../models/Commit');
const Folder = require('../models/Folder');
const File = require('../models/File');
const Branch = require('../models/Branch');
const Repository = require('../models/Repository');

const createCommit = async (req, res) => {
    try {
        const { message, branchId, folderStructure } = req.body;
        const userId = req.user.id; // Assume user is authenticated and userId is available

        // Validate the request body
        if (!message || !branchId || !Array.isArray(folderStructure)) {
            return res.status(400).json({ error: 'Invalid request data. Ensure message, branchId, and folderStructure are provided.' });
        }

        // Validate the branch belongs to the user
        const branch = await Branch.findOne({
            where: { id: branchId },
            include: {
                model: Repository,
                where: { UserId: userId }, // Ensure repository belongs to the user
            },
        });

        if (!branch) {
            return res.status(404).json({ error: 'Branch not found or access denied' });
        }

        // Create the commit
        const commit = await Commit.create({ message, BranchId: branchId });

        // Helper function to recursively create folder structure
        const createFolderStructure = async (folders, parentId = null, commitId, depth = 0) => {
            if (depth > 10) {
                throw new Error('Maximum recursion depth exceeded');
            }

            for (const folder of folders) {
                try {
                    if (!folder.name || !folder.path) {
                        console.error('Invalid folder data:', folder);
                        continue; // Skip invalid folders
                    }

                    // Create folder
                    const createdFolder = await Folder.create({
                        name: folder.name,
                        path: folder.path,
                        parentId,
                        CommitId: commitId,
                    });

                    console.log('Created Folder:', createdFolder);

                    // Recursively create subfolders
                    if (folder.subfolders && folder.subfolders.length > 0) {
                        await createFolderStructure(folder.subfolders, createdFolder.id, commitId, depth + 1);
                    }

                    // Save files in the folder
                    if (folder.files && folder.files.length > 0) {
                        for (const file of folder.files) {
                            try {
                                if (!file.name || !file.type || !file.path) {
                                    console.error('Invalid file data:', file);
                                    continue; // Skip invalid files
                                }

                                const createdFile = await File.create({
                                    name: file.name,
                                    type: file.type,
                                    path: file.path,
                                    FolderId: createdFolder.id,
                                });

                                console.log('Created File:', createdFile);
                            } catch (fileError) {
                                console.error('Error creating file:', fileError);
                            }
                        }
                    }
                } catch (folderError) {
                    console.error('Error creating folder:', folderError);
                }
            }
        };

        // Create the folder structure for the commit
        if (folderStructure && folderStructure.length > 0) {
            await createFolderStructure(folderStructure, null, commit.id);
        }

        res.status(201).json({ message: 'Commit created successfully', commit });
    } catch (error) {
        console.error('Error creating commit:', error.stack);
        res.status(500).json({ error: 'Failed to create commit' });
    }
};

const getCommitDetails = async (req, res) => {
    try {
        console.log('Request Params:', req.params);

        const { id: commitId } = req.params;
        const userId = req.user.id; // Assuming the user is authenticated and userId is available

        if (!commitId) {
            return res.status(400).json({ error: 'Commit ID is required' });
        }

        // Retrieve the commit and ensure it belongs to the authenticated user
        const commit = await Commit.findOne({
            where: { id: commitId },
            include: {
                model: Branch,
                include: {
                    model: Repository,
                    where: { UserId: userId }, // Ensure the repository belongs to the user
                },
            },
        });

        if (!commit) {
            return res.status(404).json({ error: 'Commit not found or access denied' });
        }

        // Fetch folder structure for the commit
        const folderStructure = await getFolderStructure(commitId);

        res.status(200).json({
            message: 'Commit retrieved successfully',
            commit: {
                id: commit.id,
                message: commit.message,
                createdAt: commit.createdAt,
                folderStructure,
            },
        });
    } catch (error) {
        console.error('Error retrieving commit details:', error.stack);
        res.status(500).json({ error: 'Failed to retrieve commit details' });
    }
};

// Helper function to fetch folder structure
const getFolderStructure = async (commitId) => {
    // Find all folders associated with the commit
    const folders = await Folder.findAll({
        where: { CommitId: commitId },
        include: [
            {
                model: File,
                as: 'files', // Alias for File relationship
            },
        ],
    });

    // Map each folder with its files
    const folderStructure = folders.map((folder) => ({
        id: folder.id,
        name: folder.name,
        path: folder.path,
        files: folder.files.map((file) => ({
            id: file.id,
            name: file.name,
            type: file.type,
            path: file.path,
        })),
    }));

    return folderStructure;
};




module.exports = { createCommit,getCommitDetails};
