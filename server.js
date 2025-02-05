import express from "express";
import dbConnection from "./src/configs/dbConnection.js";
import companyRoutes from "./src/routes/companyRoutes.js";

const app = express();

app.use(express.json());

app.use("/api/company", companyRoutes);

app.listen(5000, () => {
  console.log("Sever running on port : http://localhost:5000");
  dbConnection.getConnection();
});
