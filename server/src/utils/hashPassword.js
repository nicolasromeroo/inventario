
import bycrypt from "bcrypt";

export const createHash = (password) => {
  return bycrypt.hashSync(password, bycrypt.genSaltSync(10));
};

export const isValidPassword = (password, userPassword) => {
  return bycrypt.compareSync(password, userPassword); 
};