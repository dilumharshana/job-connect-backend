import CompanyModule from "./companyModel.js";

export const saveCompany = async (req, res) => {
  console.log(req.body);

  return CompanyModule.createCompany(req, res);
};
