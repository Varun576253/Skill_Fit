import { Router, type Request, type Response } from "express";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../lib/db";
import {
  adminUsersTable,
  candidatesTable,
  officerActionsTable,
  classificationsTable,
  interviewsTable,
} from "@workspace/db";
import {
  AdminLoginBody,
  CreateOfficerActionBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middleware/requireAdmin";
import { adminLoginLimiter } from "../middleware/rateLimits";
import { getPoolForTradeAndLanguage } from "../lib/question-bank";

const router = Router();

function demoCredentials(): { username: string; password: string; role: string } {
  return {
    username: process.env["ADMIN_USERNAME"] ?? "admin",
    password: process.env["ADMIN_PASSWORD"] ?? "admin123",
    role: process.env["ADMIN_ROLE"] ?? "officer",
  };
}

/** POST /admin/login — DB users (see seed:admin) first; env demo fallback for bootstrap */
router.post("/admin/login", adminLoginLimiter, async (req: Request, res: Response): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid credentials format" });
    return;
  }

  const { username, password } = parsed.data;

  const [dbUser] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, username))
    .limit(1);

  if (dbUser) {
    const ok = await bcrypt.compare(password, dbUser.passwordHash);
    if (ok) {
      req.session.adminUsername = dbUser.username;
      req.session.adminRole = dbUser.role;
      res.json({ success: true, username: dbUser.username });
      return;
    }
    res.status(401).json({ error: "Invalid username or password" });
    return;
  }

  const demo = demoCredentials();
  if (username === demo.username && password === demo.password) {
    req.session.adminUsername = username;
    req.session.adminRole = demo.role;
    res.json({ success: true, username });
    return;
  }

  res.status(401).json({ error: "Invalid username or password" });
});

/** POST /admin/logout */
router.post("/admin/logout", requireAdmin, (req: Request, res: Response): void => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

/** GET /admin/me */
router.get("/admin/me", requireAdmin, (req: Request, res: Response): void => {
  res.json({
    username: req.session.adminUsername!,
    role: req.session.adminRole ?? "officer",
  });
});

/** GET /admin/questions-pool — advanced: full pool preview (officers / QA; not required for candidates) */
router.get("/admin/questions-pool", requireAdmin, (req: Request, res: Response): void => {
  const trade = req.query["trade"] as string | undefined;
  const language = req.query["language"] as string | undefined;
  const limit = Math.min(500, Math.max(1, parseInt(req.query["limit"] as string || "100", 10)));

  if (!trade || !language) {
    res.status(400).json({ error: "trade and language are required" });
    return;
  }

  const pool = getPoolForTradeAndLanguage(trade, language);
  res.json(
    pool.slice(0, limit).map((q) => ({
      id: q.id,
      text: q.text,
      trade: q.trade,
      language: q.language,
      category: q.category,
    }))
  );
});

/** POST /admin/actions */
router.post("/admin/actions", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  const parsed = CreateOfficerActionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid action body", issues: parsed.error.issues });
    return;
  }

  const { candidateId, interviewId, action, notes } = parsed.data;

  const [candidate] = await db
    .select({ id: candidatesTable.id })
    .from(candidatesTable)
    .where(eq(candidatesTable.id, candidateId))
    .limit(1);

  if (!candidate) {
    res.status(404).json({ error: "Candidate not found" });
    return;
  }

  const [row] = await db
    .insert(officerActionsTable)
    .values({
      candidateId,
      interviewId: interviewId ?? null,
      action,
      officerUsername: req.session.adminUsername!,
      notes: notes ?? null,
    })
    .returning();

  let resolvedInterviewId = interviewId;
  if (resolvedInterviewId == null) {
    const [latestIv] = await db
      .select({ id: interviewsTable.id })
      .from(interviewsTable)
      .where(eq(interviewsTable.candidateId, candidateId))
      .orderBy(desc(interviewsTable.id))
      .limit(1);
    resolvedInterviewId = latestIv?.id ?? null;
  }

  if (resolvedInterviewId != null) {
    await db
      .update(classificationsTable)
      .set({
        reviewedBy: req.session.adminUsername!,
        reviewedAt: new Date(),
      })
      .where(eq(classificationsTable.interviewId, resolvedInterviewId));
  }

  res.status(201).json(row);
});

/** GET /admin/actions/:candidateId */
router.get(
  "/admin/actions/:candidateId",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    const rawId = req.params["candidateId"];
    const candidateId = parseInt(Array.isArray(rawId) ? rawId[0]! : rawId, 10);
    if (Number.isNaN(candidateId)) {
      res.status(400).json({ error: "Invalid candidate id" });
      return;
    }

    const rows = await db
      .select()
      .from(officerActionsTable)
      .where(eq(officerActionsTable.candidateId, candidateId))
      .orderBy(desc(officerActionsTable.createdAt));

    res.json(rows);
  },
);

export default router;
