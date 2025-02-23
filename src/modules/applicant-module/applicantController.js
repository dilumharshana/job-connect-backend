import applicantModel from "./applicantModel.js";

export const saveApplicant = async (req, res) => {
  return applicantModel.createApplicant(req, res);
};

export const allJobs = async (req, res) => {
  return applicantModel.getAllJobs(req, res);
};

export const applyJob = async (req, res) => {
  return applicantModel.applyJob(req, res);
};
