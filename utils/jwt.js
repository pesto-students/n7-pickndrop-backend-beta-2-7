import jwt from "jsonwebtoken";
const secretKey = "secretKey";
export const getToken = (id) => jwt.sign(id, secretKey);
export const getId = (token) => {
  if (!token) {
    throw "This is secured API";
  }
  return jwt.verify(token, secretKey);
};
