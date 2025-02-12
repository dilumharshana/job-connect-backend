import CompanyModule from "./companyModel.js";

export const saveCompany = async (req, res) => {
  return CompanyModule.createCompany(req, res);
};

export const saveJob = async (req, res) => {
  return CompanyModule.createJob(req, res);
};

export const allJobs = async (req, res) => {
  return CompanyModule.getAllJobs(req, res);
};
