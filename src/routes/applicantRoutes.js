import express from "express";
import {
  allJobs,
  saveApplicant
} from "../modules/applicant-module/applicantController.js";

const router = express.Router();

router.post("/", async (req, res) => await saveApplicant(req, res));
router.get("/alljobs/:category", async (req, res) => await allJobs(req, res));

export default router;
