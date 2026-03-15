import { pgTable, serial, text, integer, timestamp, boolean, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 项目状态枚举
export const projectStatusEnum = pgEnum('project_status', ['active', 'archived', 'deleted']);

// Issue 状态枚举
export const issueStatusEnum = pgEnum('issue_status', ['todo', 'in_progress', 'review', 'done', 'cancelled']);

// Issue 优先级枚举
export const issuePriorityEnum = pgEnum('issue_priority', ['low', 'medium', 'high', 'urgent']);

// 用户表（简化版，配合现有的 localStorage 认证）
export const users = pgTable('users', {
  id: text('id').primaryKey(), // user_xxx 格式
  username: text('username').notNull().unique(),
  email: text('email'),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 项目表
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').default('active').notNull(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  // 看板配置（JSON 存储列状态）
  boardConfig: text('board_config'), // JSON: { columns: [{ id, name, order }] }
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 项目成员表
export const projectMembers = pgTable('project_members', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').default('member').notNull(), // owner, admin, member
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

// Issue 表
export const issues = pgTable('issues', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: issueStatusEnum('status').default('todo').notNull(),
  priority: issuePriorityEnum('priority').default('medium').notNull(),
  // 负责人
  assigneeId: text('assignee_id').references(() => users.id),
  // 创建人
  creatorId: text('creator_id').notNull().references(() => users.id),
  // 排序权重
  orderWeight: integer('order_weight').default(0),
  // 截止日期
  dueDate: timestamp('due_date'),
  // AI 相关字段
  aiSummary: text('ai_summary'), // AI 生成的摘要
  aiTags: text('ai_tags'), // AI 提取的标签，JSON 数组
  // 元数据
  metadata: text('metadata'), // 额外存储的 JSON 数据
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Issue 标签表
export const labels = pgTable('labels', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  color: text('color').default('#6366f1'), // 默认 indigo 色
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Issue-标签关联表
export const issueLabels = pgTable('issue_labels', {
  id: serial('id').primaryKey(),
  issueId: integer('issue_id').notNull().references(() => issues.id, { onDelete: 'cascade' }),
  labelId: integer('label_id').notNull().references(() => labels.id, { onDelete: 'cascade' }),
});

// Issue 活动记录（时间线）
export const issueActivities = pgTable('issue_activities', {
  id: serial('id').primaryKey(),
  issueId: integer('issue_id').notNull().references(() => issues.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // created, updated, status_changed, commented, assigned
  content: text('content'), // 评论内容或变更描述
  metadata: text('metadata'), // 变更前后的值，JSON
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ============ Relations ============

export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  projectMemberships: many(projectMembers),
  assignedIssues: many(issues, { relationName: 'assignee' }),
  createdIssues: many(issues, { relationName: 'creator' }),
  activities: many(issueActivities),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  members: many(projectMembers),
  issues: many(issues),
  labels: many(labels),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const issuesRelations = relations(issues, ({ one, many }) => ({
  project: one(projects, {
    fields: [issues.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [issues.assigneeId],
    references: [users.id],
    relationName: 'assignee',
  }),
  creator: one(users, {
    fields: [issues.creatorId],
    references: [users.id],
    relationName: 'creator',
  }),
  labels: many(issueLabels),
  activities: many(issueActivities),
}));

export const labelsRelations = relations(labels, ({ one, many }) => ({
  project: one(projects, {
    fields: [labels.projectId],
    references: [projects.id],
  }),
  issues: many(issueLabels),
}));

export const issueLabelsRelations = relations(issueLabels, ({ one }) => ({
  issue: one(issues, {
    fields: [issueLabels.issueId],
    references: [issues.id],
  }),
  label: one(labels, {
    fields: [issueLabels.labelId],
    references: [labels.id],
  }),
}));

export const issueActivitiesRelations = relations(issueActivities, ({ one }) => ({
  issue: one(issues, {
    fields: [issueActivities.issueId],
    references: [issues.id],
  }),
  user: one(users, {
    fields: [issueActivities.userId],
    references: [users.id],
  }),
}));
