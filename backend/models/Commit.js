const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Branch = require('./Branch');
const Folder = require('./Folder');

const Commit = sequelize.define('Commit', {
    message: { type: DataTypes.STRING, allowNull: false },
});


module.exports = Commit;
