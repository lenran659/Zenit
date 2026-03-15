CREATE TYPE "public"."issue_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."issue_status" AS ENUM('todo', 'in_progress', 'review', 'done', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('active', 'archived', 'deleted');--> statement-breakpoint
CREATE TABLE "issues" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "issue_status" DEFAULT 'todo' NOT NULL,
	"priority" "issue_priority" DEFAULT 'medium' NOT NULL,
	"creator_id" text NOT NULL,
	"assignee_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'active' NOT NULL,
	"owner_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "issues" ADD CONSTRAINT "issues_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;