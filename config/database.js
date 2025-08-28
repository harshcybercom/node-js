const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,  // disable SQL logs
    }
);

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log("Sequelize connected:", process.env.DB_NAME);
    } catch (err) {
        console.error("Database connection failed:", err);
    }
}

connectDB();

module.exports = sequelize;
