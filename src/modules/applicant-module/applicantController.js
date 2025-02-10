import applicantModel from "./applicantModel.js";

export const saveApplicant = async (req, res) => {
  console.log(req.body);

  return applicantModel.createApplicant(req, res);
};
