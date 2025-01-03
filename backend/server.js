// Importing Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sequelize, connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const repoRoutes = require('./routes/repoRoutes');
const commitRoutes = require('./routes/commitRoutes');

// Import Associations
require('./models/associations'); // Load associations (ensure all models are associated here)

// Initializing Express App
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MySQL Database
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/repo', repoRoutes);
app.use('/commit', commitRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Version Control System API');
});

// Sync Sequelize Models
(async () => {
    try {
        await sequelize.sync({ alter: true }); // Sync database schema
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error.message);
    }
})();

// Error Handling Middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err); // Delegate to default Express error handler
    }
    console.error('Error Stack:', err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
