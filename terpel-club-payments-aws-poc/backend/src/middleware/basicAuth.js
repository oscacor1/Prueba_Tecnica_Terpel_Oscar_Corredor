import { AppError } from "../services/errors.js";

export function requireBasic(req, _res, next) {
  const header = req.headers["authorization"] || "";
  if (!header.startsWith("Basic ")) {
    return next(new AppError({ statusCode: 401, code: "AUTH_BASIC_MISSING", message: "Missing Basic auth" }));
  }
  const raw = Buffer.from(header.slice(6), "base64").toString("utf-8");
  const [user, pass] = raw.split(":");
  if (user !== process.env.BASIC_USER || pass !== process.env.BASIC_PASS) {
    return next(new AppError({ statusCode: 403, code: "AUTH_BASIC_INVALID", message: "Invalid Basic credentials" }));
  }
  return next();
}
