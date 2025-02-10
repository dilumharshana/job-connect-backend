import express from "express";
import { saveApplicant } from "../modules/applicant-module/applicantController.js";

const router = express.Router();

router.post("/", async (req, res) => await saveApplicant(req, res));

export default router;
