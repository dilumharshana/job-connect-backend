import express from "express";
import {
  allJobs,
  dashboardData,
  saveCompany,
  saveJob
} from "../modules/company-module/companyController.js";

const router = express.Router();

router.get(
  "/:companyId/dashboard/",
  async (req, res) => await dashboardData(req, res)
);
router.get("/:companyId/jobs/", async (req, res) => await allJobs(req, res));

router.post("/", async (req, res) => await saveCompany(req, res));
router.post("/job/", async (req, res) => await saveJob(req, res));

export default router;
