import express from "express";
import cors from "cors";
import { db } from "./data.js";
import talentsRouter from "./routes/talents.js";
import companiesRouter from "./routes/companies.js";
import tasksRouter from "./routes/tasks.js";
import submissionsRouter from "./routes/submissions.js";
import decisionsRouter from "./routes/decisions.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/seed", (_req, res) => {
  res.json({
    talents: db.talents,
    companies: db.companies,
    tasks: db.tasks,
    submissions: db.submissions,
    decisions: db.decisions,
  });
});

app.use("/api/talents", talentsRouter);
app.use("/api/companies", companiesRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/decisions", decisionsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
