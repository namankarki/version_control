const {Sequelize} = require ("sequelize");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    }
);

const connectDB = async () => {

    try{
        await sequelize.authenticate();
        console.log('MySQL connected successfully.');
    }catch (error){
        console.error('Unable to connect to MySQL: ', error.message);
    }
};

module.exports ={ sequelize, connectDB};