import express from "express";
import {
  allJobs,
  appliedJobs,
  applyJob,
  getSettings,
  saveApplicant,
  updateApplicantQualifications
} from "../modules/applicant-module/applicantController.js";

const router = express.Router();

router.get(
  "/alljobs/:category/:applicantId",
  async (req, res) => await allJobs(req, res)
);
router.get(
  "/:applicantId/applied",
  async (req, res) => await appliedJobs(req, res)
);
router.get(
  "/:applicantId/settings",
  async (req, res) => await getSettings(req, res)
);

router.post("/", async (req, res) => await saveApplicant(req, res));
router.post("/apply", async (req, res) => await applyJob(req, res));
router.post(
  "/qualifications",
  async (req, res) => await updateApplicantQualifications(req, res)
);

export default router;
