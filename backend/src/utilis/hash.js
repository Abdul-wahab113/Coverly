import crypto from "crypto";

// ─── Generate Salt ────────────────────────────────────────────────────────────

export const generateSalt = () => {
    return crypto.randomBytes(16).toString("hex");
};

// ─── Hash Password ────────────────────────────────────────────────────────────

export const hashPassword = (password, salt) => {
    return crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha512")
        .toString("hex");
};

// ─── Verify Password ──────────────────────────────────────────────────────────

export const verifyPassword = (password, salt, storedHash) => {
    const hash = hashPassword(password, salt);
    return crypto.timingSafeEqual(
        Buffer.from(hash, "hex"),
        Buffer.from(storedHash, "hex")
    );
};