const { Sequelize } = require("sequelize")

module.exports = new Sequelize(
  process.env.DB_NAME, // название бд
  process.env.DB_USER, //имя пользователя, под которым мы подключаемся
  process.env.DB_PASSWORD, // Пароль
  {
    dialect: "postgres", // mysql || postgres
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
)
