import { Router } from "express";
import { db } from "../data.js";
import type { Submission } from "../types.js";

const router = Router();

router.get("/", (_req, res) => res.json(db.submissions));

router.post("/", (req, res) => {
  const submission: Submission = { id: `s-${Date.now()}`, ...req.body };
  // Replace if same talent+task already submitted
  const idx = db.submissions.findIndex(
    (x) => x.taskId === submission.taskId && x.talentId === submission.talentId
  );
  if (idx !== -1) {
    db.submissions[idx] = submission;
  } else {
    db.submissions.push(submission);
  }
  res.status(201).json(submission);
});

router.patch("/:id", (req, res) => {
  const idx = db.submissions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.submissions[idx] = { ...db.submissions[idx], ...req.body };
  res.json(db.submissions[idx]);
});

export default router;
