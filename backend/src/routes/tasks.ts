import { Router } from "express";
import { db } from "../data.js";

const router = Router();

router.get("/", (_req, res) => res.json(db.tasks));

router.get("/:id", (req, res) => {
  const task = db.tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Not found" });
  res.json(task);
});

router.patch("/:id", (req, res) => {
  const idx = db.tasks.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.tasks[idx] = { ...db.tasks[idx], ...req.body };
  res.json(db.tasks[idx]);
});

export default router;
