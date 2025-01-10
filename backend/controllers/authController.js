
const User=require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Repository= require('../models/Repository');


const register = async (req, res) => {
    try {
        const { username, email, password, age, description } = req.body;
        const photo = req.file ? req.file.filename : null; // Get the uploaded photo filename

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        if (age && (isNaN(age) || age < 0)) {
            return res.status(400).json({ error: "Age must be a non-negative number" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            photo,
            age,
            description,
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Error in register:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};





const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming authentication middleware sets req.user

        // Fetch user details
        const user = await User.findByPk(userId, {
            attributes: ["id", "username", "email", "photo", "age", "description"],
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch repositories only if they exist
        const repositories = await Repository.findAll({
            where: { UserId: userId },
            attributes: ["id", "name", "createdAt"], // Fetch specific repository fields
        });

        // Include repositories in the response if available
        const response = {
            ...user.toJSON(), // Convert Sequelize model instance to plain object
        };

        if (repositories.length > 0) {
            response.repositories = repositories;
        }

        res.status(200).json(response);
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};



// Logout a User
const logout = async (req, res) => {
    try {
        
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


const editUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming authentication middleware sets req.user
        const { username, email, age, description } = req.body;
        const photo = req.file ? req.file.filename : null; // Handle photo if uploaded

        // Validate input (e.g., non-negative age)
        if (age && (isNaN(age) || age < 0)) {
            return res.status(400).json({ error: "Age must be a non-negative number" });
        }

        // Fetch user from the database
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user details
        user.username = username || user.username; // Only update if provided
        user.email = email || user.email;
        user.age = age || user.age;
        user.description = description || user.description;

        // Update photo only if a new file is uploaded
        if (photo) {
            user.photo = photo;
        }

        // Save updated user details to the database
        await user.save();

        res.status(200).json({ message: "User details updated successfully", user });
    } catch (error) {
        console.error("Error updating user details:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};



module.exports = {
    register,
    login,
    logout,
    getUserDetails,
    editUserDetails
};
