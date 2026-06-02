import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { userSettings } from "../db/schema.js";

// ─── Get User Settings ────────────────────────────────────────────────────────

export const getUserSettings = (userId) => {
    return db
        .select()
        .from(userSettings)
        .where(eq(userSettings.userId, userId))
        .then((rows) => {
            if (rows[0]) return rows[0];

            // create a default row for legacy users who don't have one yet
            return db
                .insert(userSettings)
                .values({ userId })
                .returning()
                .then((created) => created[0]);
        });
};

// ─── Update User Settings ─────────────────────────────────────────────────────

export const updateUserSettings = (userId, data) => {
    return db
        .update(userSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(userSettings.userId, userId))
        .returning()
        .then((rows) => {
            if (rows[0]) return rows[0];

            // no row existed — create one
            return db
                .insert(userSettings)
                .values({ userId, ...data })
                .returning()
                .then((created) => created[0]);
        });
};
