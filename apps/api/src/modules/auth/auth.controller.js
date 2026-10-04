import {
  login,
  register,
} from "./auth.service.js";

export async function registerController(req, res) {
  try {
    const { email, password } = req.body;

    const user = await register(
      email,
      password,
    );

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Registration failed",
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const result = await login(
      email,
      password,
    );

    res.json(result);
  } catch (error) {
    res.status(401).json({
      message:
        error instanceof Error
          ? error.message
          : "Login failed",
    });
  }
}