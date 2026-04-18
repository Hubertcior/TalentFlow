import { Router } from "express";
import { db } from "../data.js";

const router = Router();

router.get("/", (_req, res) => res.json(db.companies));

router.get("/:id", (req, res) => {
  const company = db.companies.find((c) => c.id === req.params.id);
  if (!company) return res.status(404).json({ error: "Not found" });
  res.json(company);
});

export default router;
