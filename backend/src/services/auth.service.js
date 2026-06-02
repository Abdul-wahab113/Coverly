import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, userSettings } from "../db/schema.js";
import { generateSalt, hashPassword, verifyPassword } from "../utilis/hash.js";

// ─── Find User By Email ───────────────────────────────────────────────────────

export const findUserByEmail = (email) => {
    return db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((rows) => rows[0] || null);
};

// ─── Find User By ID ──────────────────────────────────────────────────────────

export const findUserById = (id) => {
    return db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((rows) => rows[0] || null);
};

// ─── Create User ──────────────────────────────────────────────────────────────

export const createUser = (fullName, email, password) => {
    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    return db
        .insert(users)
        .values({ fullName, email, passwordHash, salt })
        .returning()
        .then((rows) => rows[0]);
};

// ─── Create Default User Settings ────────────────────────────────────────────

export const createUserSettings = (userId) => {
    return db
        .insert(userSettings)
        .values({ userId })
        .returning()
        .then((rows) => rows[0]);
};

// ─── Validate Password ────────────────────────────────────────────────────────

export const validatePassword = (password, salt, storedHash) => {
    return verifyPassword(password, salt, storedHash);
};