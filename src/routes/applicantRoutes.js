import express from "express";
import {
  allJobs,
  applyJob,
  saveApplicant
} from "../modules/applicant-module/applicantController.js";

const router = express.Router();

router.get(
  "/alljobs/:category/:applicantId",
  async (req, res) => await allJobs(req, res)
);

router.post("/", async (req, res) => await saveApplicant(req, res));
router.post("/apply", async (req, res) => await applyJob(req, res));

export default router;
