import express from "express";
import dbConnection from "./src/configs/dbConnection.js";

const app = express();
app.listen(5000, () => dbConnection.getConnection());
