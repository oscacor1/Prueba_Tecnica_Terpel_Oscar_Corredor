import jwt from "jsonwebtoken";
import { AppError } from "../services/errors.js";
import { isUsed, markUsed } from "../services/tokenStore.js";

export function requireJwtSingleUse(req, _res, next) {
  const header = req.headers["authorization"] || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new AppError({ statusCode: 401, code: "AUTH_MISSING", message: "Missing Bearer token" }));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload?.jti) {
      return next(new AppError({ statusCode: 401, code: "AUTH_INVALID", message: "Invalid token (missing jti)" }));
    }

    // Allow opt-out for local dev/testing
    const allowReuse = req.headers["x-allow-token-reuse"] === "true";
    if (!allowReuse && isUsed(payload.jti)) {
      return next(new AppError({ statusCode: 401, code: "AUTH_TOKEN_CONSUMED", message: "Token already used (one token per call)" }));
    }

    if (!allowReuse) markUsed(payload.jti);

    req.user = { doc: payload.sub, scopes: payload.scopes || [] };
    return next();
  } catch (e) {
    return next(new AppError({ statusCode: 401, code: "AUTH_INVALID", message: "Invalid/expired token" }));
  }
}
