const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Folder = require('./Folder');
const File = sequelize.define('File', {
    name: { type: DataTypes.STRING, allowNull: false }, // File name
    type: { type: DataTypes.STRING, allowNull: false }, // MIME type (e.g., "image/png")
    path: { type: DataTypes.STRING, allowNull: false }, // Full path (e.g., "root/folder1/file1.png")
});


module.exports = File;
