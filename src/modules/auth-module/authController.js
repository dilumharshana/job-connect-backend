import AuthModule from "./authModel.js";

export const authUser = async (req, res) => {
  return AuthModule.userLogin(req, res);
};
