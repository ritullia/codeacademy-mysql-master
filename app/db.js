const mysql = require("mysql2");

const mysqlConfigBase = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
};

const tasksManagerConnection = mysql.createConnection({
  ...mysqlConfigBase,
  database: "tasks_manager",
});

//kiuriama duomenu baze ir jos lenetele naudojama perrasymui DB

tasksManagerConnection.query(
  "CREATE DATABASE IF NOT EXISTS tasks_manager",
  function (err) {
    if (err) throw err;
    console.log("Database tasks_manager created");

    tasksManagerConnection.query("USE tasks_manager", (err) => {
      if (err) throw err;

      const productsTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(100),
            description VARCHAR(400),
            price DECIMAL(6,2),
            discountPercentage INT,
            rating DECIMAL(3,2),
            stock DECIMAL(3,2),
            brand VARCHAR(100),
            category VARCHAR(100),
            thumbnail VARCHAR(500),
            primary key (id)
      )
      
      `;
      tasksManagerConnection.query(productsTableQuery, function (err) {
        if (err) throw err;
        console.log("Products Table created");
      });

      const usersQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100),
        email VARCHAR(100),
        password VARCHAR(100),
        primary key (id)
      )
      `;

      tasksManagerConnection.query(usersQuery, function (err) {
        if (err) throw err;
        console.log("Users Table created");
      });
    });
  }
);

const codeacademyConnection = mysql.createConnection({
  ...mysqlConfigBase,
  database: "codeacademy",
});

module.exports = {
  tasksManagerConnection,
  codeacademyConnection,
};
