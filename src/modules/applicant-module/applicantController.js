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

export const appliedJobs = async (req, res) => {
  return applicantModel.getAllAppliedJobs(req, res);
};

export const updateApplicantQualifications = async (req, res) => {
  return applicantModel.updateApplicantQualifications(req, res);
};

export const getSettings = async (req, res) => {
  return applicantModel.getSettings(req, res);
};
