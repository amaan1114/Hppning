import express from "express";

import globalHandler from "./middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);

app.use(globalHandler);
export default app;