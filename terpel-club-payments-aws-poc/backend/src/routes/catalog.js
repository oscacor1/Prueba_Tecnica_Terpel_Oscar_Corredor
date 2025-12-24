import { Router } from "express";
import { requireBasic } from "../middleware/basicAuth.js";

export const catalogRouter = Router();

catalogRouter.get("/", requireBasic, (_req, res) => {
  res.json({
    items: [
      { id: "p1", name: "Lavado Premium", description: "Servicio de lavado completo", imageUrl: "https://picsum.photos/seed/terpel1/300/200" },
      { id: "p2", name: "Cambio de aceite", description: "Aceite + filtro", imageUrl: "https://picsum.photos/seed/terpel2/300/200" },
      { id: "p3", name: "Combo tienda", description: "Snack + bebida", imageUrl: "https://picsum.photos/seed/terpel3/300/200" }
    ]
  });
});
