import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const tools = sqliteTable("tools", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  websiteUrl: text("website_url").notNull(),
  logoUrl: text("logo_url"),
  category: text("category").notNull().default("other"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const toolVersions = sqliteTable("tool_versions", {
  id: text("id").primaryKey(),
  toolId: text("tool_id").notNull().references(() => tools.id),
  version: text("version").notNull(),
  changelog: text("changelog"),
  releasedAt: integer("released_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  category: text("category").notNull().default("other"),
  tags: text("tags"),
  published: integer("published", { mode: "boolean" }).default(false),
  authorId: text("author_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const categories = ["product", "design", "frontend", "backend", "test", "other"] as const;
export type Category = (typeof categories)[number];
