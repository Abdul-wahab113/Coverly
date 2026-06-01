import jwt from "jsonwebtoken";
import { config } from "../config.js";

// ─── Generate Token ───────────────────────────────────────────────────────────

export const generateToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
};

// ─── Verify Token ─────────────────────────────────────────────────────────────

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });
};