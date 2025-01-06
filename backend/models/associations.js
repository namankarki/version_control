const Folder = require('./Folder');
const Commit = require('./Commit');
const File = require('./File');
const Branch = require('./Branch');
const User = require('./User');
const Repository = require('./Repository');

// Define Associations
User.hasMany(Repository);
Repository.belongsTo(User);
Repository.hasMany(Branch);
Branch.belongsTo(Repository);
Branch.hasMany(Commit);
Folder.belongsTo(Folder, { as: 'parentFolder', foreignKey: 'parentId' });
Folder.belongsTo(Commit);
Folder.hasMany(File, { as: 'files' });
Commit.hasMany(Folder, { as: 'folders' });
File.belongsTo(Folder, {as: "Folder"});
Commit.belongsTo(Branch);

console.log('Associations initialized successfully.');


