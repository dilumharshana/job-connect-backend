import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

class Database {
  static instance = null;

  constructor() {
    if (!Database.instance) {
      this.connection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME
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
