const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Commit = require('./Commit');

const Folder = sequelize.define('Folder', {
    name: { type: DataTypes.STRING, allowNull: false }, // Folder name
    path: { type: DataTypes.STRING, allowNull: false }, // Full path (e.g., "root/subfolder1")
});



module.exports = Folder;
