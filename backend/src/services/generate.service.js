import { eq, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { generations } from "../db/schema.js";

// ─── Save Generation ──────────────────────────────────────────────────────────

export const saveGeneration = (userId, input, output) => {
    return db
        .insert(generations)
        .values({
            userId,
            jobTitle: input.jobTitle,
            companyName: input.companyName,
            jobDescription: input.jobDescription,
            userBackground: input.userBackground,
            tone: input.tone,
            coverLetter: output.coverLetter,
            coldEmailSubject: output.coldEmail.subject,
            coldEmailBody: output.coldEmail.body,
        })
        .returning()
        .then((rows) => rows[0]);
};

// ─── Get User Generations ─────────────────────────────────────────────────────

export const getUserGenerations = (userId) => {
    return db
        .select()
        .from(generations)
        .where(eq(generations.userId, userId))
        .orderBy(desc(generations.createdAt));
};

// ─── Get Single Generation ────────────────────────────────────────────────────

export const getGenerationById = (id, userId) => {
    return db
        .select()
        .from(generations)
        .where(eq(generations.id, id))
        .then((rows) => {
            const generation = rows[0];

            // ensure user can only access their own generations
            if (!generation || generation.userId !== userId) {
                return Promise.reject({ status: 404, message: "Generation not found" });
            }

            return generation;
        });
};

// ─── Delete Generation ────────────────────────────────────────────────────────

export const deleteGeneration = (id, userId) => {
    return getGenerationById(id, userId).then(() => {
        return db
            .delete(generations)
            .where(eq(generations.id, id))
            .returning()
            .then((rows) => rows[0]);
    });
};