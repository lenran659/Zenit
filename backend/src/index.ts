import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm';

import { db, projects, users, issues } from './db';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// MVP: ensure a default user exists
async function ensureDefaultUser() {
  const defaultUserId = 'user_alice';
  const existing = await db.query.users.findFirst({ where: eq(users.id, defaultUserId) });
  if (!existing) {
    await db.insert(users).values({ id: defaultUserId, username: 'Alice' });
  }
}

app.get('/api/projects', async (_req, res) => {
  const rows = await db.select().from(projects).orderBy(desc(projects.id));
  res.json(rows);
});

app.post('/api/projects', async (req, res) => {
  const bodySchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  });
  const body = bodySchema.parse(req.body);

  const row = await db
    .insert(projects)
    .values({
      name: body.name,
      description: body.description,
      ownerId: 'user_alice',
    })
    .returning();

  res.status(201).json(row[0]);
});

app.get('/api/projects/:projectId/issues', async (req, res) => {
  const projectId = Number(req.params.projectId);
  if (!Number.isFinite(projectId)) return res.status(400).json({ error: 'invalid projectId' });

  const rows = await db.select().from(issues).where(eq(issues.projectId, projectId)).orderBy(desc(issues.id));
  res.json(rows);
});

app.post('/api/projects/:projectId/issues', async (req, res) => {
  const projectId = Number(req.params.projectId);
  if (!Number.isFinite(projectId)) return res.status(400).json({ error: 'invalid projectId' });

  const bodySchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  });
  const body = bodySchema.parse(req.body);

  const row = await db
    .insert(issues)
    .values({
      projectId,
      title: body.title,
      description: body.description,
      priority: body.priority ?? 'medium',
      creatorId: 'user_alice',
    })
    .returning();

  res.status(201).json(row[0]);
});

const port = Number(process.env.PORT || 3001);

(async () => {
  await ensureDefaultUser();
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Zenit backend listening on :${port}`);
  });
})();
