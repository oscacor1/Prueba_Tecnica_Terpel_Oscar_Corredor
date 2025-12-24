import { Router } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../services/errors.js";

export const authRouter = Router();

/**
 * POST /auth/token
 * Body: { docNumber: "123" }
 * Returns short-lived JWT. Intended to be used "one token per call" (enforced by middleware).
 */
authRouter.post("/token", (req, res, next) => {
  const docNumber = String(req.body?.docNumber || "").trim();
  if (!docNumber) return next(new AppError({ statusCode: 400, code: "VALIDATION_ERROR", message: "docNumber is required" }));

  const ttl = Number(process.env.TOKEN_TTL_SECONDS || 60);
  const jti = uuidv4();

  const token = jwt.sign(
    { scopes: ["read:catalog","read:points","read:movements","pay:create","pay:read"], jti },
    process.env.JWT_SECRET,
    { subject: docNumber, expiresIn: ttl }
  );

  res.json({ accessToken: token, tokenType: "Bearer", expiresIn: ttl });
});
