import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { requireJwtSingleUse } from "../middleware/jwtSingleUse.js";
import { AppError } from "../services/errors.js";

export const paymentsRouter = Router();

const intents = new Map(); // intentId -> intent
const idempotency = new Map(); // key -> intentId

function validateIntent(body) {
  const mode = body?.paymentMode;
  if (!["CARD","POINTS","MIXED"].includes(mode)) {
    throw new AppError({ statusCode: 400, code: "VALIDATION_ERROR", message: "paymentMode must be CARD|POINTS|MIXED" });
  }
  const amount = Number(body?.amount || 0);
  if (!(amount > 0)) throw new AppError({ statusCode: 400, code: "VALIDATION_ERROR", message: "amount must be > 0" });
  if (!body?.merchantId) throw new AppError({ statusCode: 400, code: "VALIDATION_ERROR", message: "merchantId is required" });

  if (mode === "CARD" || mode === "MIXED") {
    if (!body?.cardToken) throw new AppError({ statusCode: 400, code: "VALIDATION_ERROR", message: "cardToken is required for CARD/MIXED" });
  }
  if (mode === "POINTS" || mode === "MIXED") {
    const points = Number(body?.pointsToUse || 0);
    if (!(points > 0)) throw new AppError({ statusCode: 400, code: "VALIDATION_ERROR", message: "pointsToUse must be > 0 for POINTS/MIXED" });
  }
}

paymentsRouter.post("/intents", requireJwtSingleUse, (req, res, next) => {
  try {
    const idemKey = req.headers["idempotency-key"];
    if (!idemKey) throw new AppError({ statusCode: 400, code: "IDEMPOTENCY_REQUIRED", message: "Idempotency-Key header is required" });

    if (idempotency.has(idemKey)) {
      const intentId = idempotency.get(idemKey);
      return res.status(200).json(intents.get(intentId));
    }

    validateIntent(req.body);

    const intentId = "pi_" + uuidv4().replaceAll("-", "").slice(0, 16);
    const intent = {
      intentId,
      userDoc: req.user.doc,
      merchantId: req.body.merchantId,
      amount: Number(req.body.amount),
      currency: req.body.currency || "COP",
      paymentMode: req.body.paymentMode,
      pointsToUse: req.body.pointsToUse || 0,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };
    intents.set(intentId, intent);
    idempotency.set(idemKey, intentId);

    return res.status(201).json(intent);
  } catch (e) {
    return next(e);
  }
});

paymentsRouter.post("/:intentId/confirm", requireJwtSingleUse, (req, res, next) => {
  const intentId = req.params.intentId;
  const intent = intents.get(intentId);
  if (!intent) return next(new AppError({ statusCode: 404, code: "NOT_FOUND", message: "Intent not found" }));
  if (intent.userDoc !== req.user.doc) return next(new AppError({ statusCode: 403, code: "FORBIDDEN", message: "Intent does not belong to user" }));

  // Demo: randomly simulate declines/timeouts if asked
  const simulate = String(req.query.simulate || "").toLowerCase();
  if (simulate === "decline") {
    intent.status = "DECLINED";
    return res.status(402).json({ ...intent, status: intent.status, reason: "CARD_DECLINED" });
  }
  if (simulate === "timeout") {
    return next(new AppError({ statusCode: 504, code: "GATEWAY_TIMEOUT", message: "Payment gateway timeout (simulate)" }));
  }

  intent.status = "CONFIRMED";
  intent.confirmedAt = new Date().toISOString();
  return res.json(intent);
});

paymentsRouter.get("/:intentId", requireJwtSingleUse, (req, res, next) => {
  const intent = intents.get(req.params.intentId);
  if (!intent) return next(new AppError({ statusCode: 404, code: "NOT_FOUND", message: "Intent not found" }));
  if (intent.userDoc !== req.user.doc) return next(new AppError({ statusCode: 403, code: "FORBIDDEN", message: "Intent does not belong to user" }));
  return res.json(intent);
});

// Admin: list all (for web-admin)
paymentsRouter.get("/", (req, res) => {
  res.json({ items: Array.from(intents.values()).sort((a,b) => (a.createdAt < b.createdAt ? 1 : -1)) });
});
