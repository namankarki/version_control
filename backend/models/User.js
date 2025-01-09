const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db");

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0, // Age must be at least 0
            isInt: true, // Ensure it's an integer
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

module.exports = User;
