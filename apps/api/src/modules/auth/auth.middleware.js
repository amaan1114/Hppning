import { verifyToken } from "../../utils/jwtToken.js";
import HttpError from "../../utils/httpError.js";

export const authMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return next(new HttpError(401, "Access token not found"));
    }
    req.user = verifyToken(accessToken);
    next();
  } catch (error) {
    next(error);
  }
};