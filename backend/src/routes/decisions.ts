import { Router } from "express";
import { db } from "../data.js";
import type { Decision } from "../types.js";

const router = Router();

router.get("/", (_req, res) => res.json(db.decisions));

router.post("/", (req, res) => {
  const decision: Decision = { id: `d-${Date.now()}`, ...req.body };
  db.decisions.push(decision);
  res.status(201).json(decision);
});

router.patch("/:id", (req, res) => {
  const idx = db.decisions.findIndex((d) => d.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.decisions[idx] = { ...db.decisions[idx], ...req.body };
  res.json(db.decisions[idx]);
});

export default router;
