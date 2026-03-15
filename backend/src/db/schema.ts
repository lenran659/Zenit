import { pgTable, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Align with frontend types in app/types.ts
export const projectStatusEnum = pgEnum('project_status', ['active', 'archived', 'deleted']);
export const issueStatusEnum = pgEnum('issue_status', ['backlog', 'todo', 'in_progress', 'done']);
export const issuePriorityEnum = pgEnum('issue_priority', ['urgent', 'high', 'medium', 'low']);
export const issueTypeEnum = pgEnum('issue_type', ['issue', 'bug']);

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  status: projectStatusEnum('status').default('active').notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  memberIds: text('member_ids').notNull().default('[]'), // JSON string array
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const issues = pgTable('issues', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  descriptionMarkdown: text('description_markdown').notNull().default(''),
  type: issueTypeEnum('type').default('issue').notNull(),
  status: issueStatusEnum('status').default('todo').notNull(),
  priority: issuePriorityEnum('priority').default('medium').notNull(),
  assigneeId: text('assignee_id'),
  watcherIds: text('watcher_ids').notNull().default('[]'), // JSON string array
  creatorId: text('creator_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
