import { Router } from "express";
import { db } from "../data.js";

const router = Router();

router.get("/", (_req, res) => res.json(db.talents));

router.get("/:id", (req, res) => {
  const talent = db.talents.find((t) => t.id === req.params.id);
  if (!talent) return res.status(404).json({ error: "Not found" });
  res.json(talent);
});

router.patch("/:id", (req, res) => {
  const idx = db.talents.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.talents[idx] = { ...db.talents[idx], ...req.body };
  res.json(db.talents[idx]);
});

export default router;
