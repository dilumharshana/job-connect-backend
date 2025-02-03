import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

class Database {
  static instance = null;

  constructor() {
    console.log("xxx =>", process.env.DATABASE_NAME);

    if (!Database.instance) {
      this.connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
      });

      this.connection.connect((err) => {
        if (err) throw err;
        console.log("Connected to database!");
      });

      Database.instance = this;
    }

    return Database.instance;
  }

  getConnection() {
    return this.connection;
  }
}

export default new Database();
