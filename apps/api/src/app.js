import express from "express";
import { httpResponse } from "./utils/httpResponse.js";
import authRoutes from "./modules/auth/auth.routes.js";
import globalHandler from "./middleware/error.middleware.js";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

app.get("/health", (req, res) => {
  return httpResponse(true, res, req, 200, "Server is Health");
});

app.use("/api/auth", authRoutes);

app.use(globalHandler);

export default app;