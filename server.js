import express from "express";
import dbConnection from "./src/configs/dbConnection.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import applicantRoutes from "./src/routes/applicantRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/company", companyRoutes);
app.use("/api/applicant", applicantRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Sever running on port : http://localhost:5000");
  dbConnection.getConnection();
});
