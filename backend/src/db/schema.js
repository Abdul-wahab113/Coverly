import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    salt: text("salt").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── User Settings ────────────────────────────────────────────────────────────

export const userSettings = pgTable("user_settings", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: "cascade" }),
    defaultBackground: text("default_background"),
    defaultTone: text("default_tone").default("professional"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Generations ─────────────────────────────────────────────────────────────

export const generations = pgTable("generations", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    jobTitle: text("job_title").notNull(),
    companyName: text("company_name").notNull(),
    jobDescription: text("job_description").notNull(),
    userBackground: text("user_background").notNull(),
    tone: text("tone").notNull().default("professional"),
    coverLetter: text("cover_letter").notNull(),
    coldEmailSubject: text("cold_email_subject").notNull(),
    coldEmailBody: text("cold_email_body").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});