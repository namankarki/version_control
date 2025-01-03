const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
;

const Repository = sequelize.define('Repository', {
    name: { type: DataTypes.STRING, allowNull: false },
    defaultBranch: { type: DataTypes.STRING, defaultValue: 'main' },
});



module.exports = Repository;
