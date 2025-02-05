import express from "express";
import { saveCompany } from "../modules/company-module/companyController.js";

const router = express.Router();

router.post("/", async (req, res) => await saveCompany(req, res));

export default router;
