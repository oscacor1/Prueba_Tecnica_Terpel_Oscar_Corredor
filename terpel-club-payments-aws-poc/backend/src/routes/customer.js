import { Router } from "express";
import { requireJwtSingleUse } from "../middleware/jwtSingleUse.js";
import { AppError } from "../services/errors.js";

export const customerRouter = Router();

customerRouter.get("/:doc/points", requireJwtSingleUse, (req, res, next) => {
  const doc = req.params.doc;
  if (req.user.doc !== doc) return next(new AppError({ statusCode: 403, code: "FORBIDDEN", message: "Token subject does not match requested customer" }));

  res.json({
    customer: { doc },
    pointsBalance: 42000,
    benefits: [{ id: "b1", name: "Descuento 5%", description: "Aplica en tienda aliada" }]
  });
});

customerRouter.get("/:doc/movements", requireJwtSingleUse, (req, res, next) => {
  const doc = req.params.doc;
  if (req.user.doc !== doc) return next(new AppError({ statusCode: 403, code: "FORBIDDEN", message: "Token subject does not match requested customer" }));

  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.max(1, Number(req.query.pageSize || 4)); // required: 4 per page by default
  if (pageSize !== 4) {
    // enforce requirement strictly; you can relax if needed
    return next(new AppError({ statusCode: 400, code: "VALIDATION_ERROR", message: "pageSize must be 4" }));
  }

  const all = [
    { id: "m1", date: "2025-12-01", description: "Gasolina", amount: 120000 },
    { id: "m2", date: "2025-12-03", description: "Tienda aliada", amount: 18000 },
    { id: "m3", date: "2025-12-05", description: "Lavado", amount: 35000 },
    { id: "m4", date: "2025-12-07", description: "Gasolina", amount: 98000 },
    { id: "m5", date: "2025-12-10", description: "Gasolina", amount: 110000 },
    { id: "m6", date: "2025-12-15", description: "Tienda aliada", amount: 22000 },
    { id: "m7", date: "2025-12-18", description: "Gasolina", amount: 90000 },
    { id: "m8", date: "2025-12-20", description: "Lavado", amount: 30000 },
  ];

  const start = (page - 1) * pageSize;
  const items = all.slice(start, start + pageSize);

  res.json({
    customer: { doc },
    page,
    pageSize,
    total: all.length,
    totalPages: Math.ceil(all.length / pageSize),
    items
  });
});
