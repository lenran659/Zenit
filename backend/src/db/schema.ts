import { pgTable, serial, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const projectStatusEnum = pgEnum('project_status', ['active', 'archived', 'deleted']);
export const issueStatusEnum = pgEnum('issue_status', ['todo', 'in_progress', 'review', 'done', 'cancelled']);
export const issuePriorityEnum = pgEnum('issue_priority', ['low', 'medium', 'high', 'urgent']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('active').notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: issueStatusEnum('status').default('todo').notNull(),
  priority: issuePriorityEnum('priority').default('medium').notNull(),
  creatorId: text('creator_id').notNull().references(() => users.id),
  assigneeId: text('assignee_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  project: one(projects, {
    fields: [issues.projectId],
    references: [projects.id],
  }),
  creator: one(users, {
    fields: [issues.creatorId],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [issues.assigneeId],
    references: [users.id],
  }),
}));
