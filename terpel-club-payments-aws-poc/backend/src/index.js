import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { authRouter } from "./routes/auth.js";
import { catalogRouter } from "./routes/catalog.js";
import { customerRouter } from "./routes/customer.js";
import { paymentsRouter } from "./routes/payments.js";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/auth", authRouter);
app.use("/v1/catalog", catalogRouter);
app.use("/v1/customers", customerRouter);
app.use("/v1/payments", paymentsRouter);

// Centralized error handler
app.use((err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const code = err.code || "INTERNAL_ERROR";
  const message = err.message || "Unexpected error";
  res.status(status).json({
    error: { code, message, details: err.details || undefined }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Backend dummy listening on http://localhost:${port}`));
