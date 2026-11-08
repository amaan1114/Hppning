import { httpResponse } from "../../utils/httpResponse.js";
import {
  signUpService,
  signInService,
  getMeService,
  verifyEmailService,
} from "./auth.service.js";
import { cookieConfig } from "../../utils/config.js";


export const signUpController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    await signUpService(name, email, password);
    return httpResponse(true, res, req, 201, "User Created Successfully");
  } catch (error) {
    next(error);
  }
};

export const signInController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await signInService(email, password);
    res.cookie("refreshToken", refreshToken, cookieConfig);
    res.cookie("accessToken", accessToken, cookieConfig);
    return httpResponse(true, res, req, 200, "User Signed In Successfully");
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const user = await getMeService(req.user);
    return httpResponse(
      true,
      res,
      req,
      200,
      "User Data Retrieved Successfully",
      user,
    );
  } catch (error) {
    next(error);
  }
};

export const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.body;
    await verifyEmailService(token);
    return httpResponse(true, res, req, 200, "Email Verified Successfully");
  } catch (error) {
    next(error);
  }
};