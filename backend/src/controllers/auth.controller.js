import {
    findUserByEmail,
    findUserById,
    createUser,
    createUserSettings,
    validatePassword,
} from "../services/auth.service.js";
import { generateToken, verifyToken } from "../utilis/jwt.js";

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = (req, res, next) => {
    const { fullName, email, password } = req.body;

    findUserByEmail(email)
        .then((existing) => {
            if (existing) {
                return Promise.reject({ status: 409, message: "Email already registered" });
            }
            return createUser(fullName, email, password);
        })
        .then((user) => {
            return createUserSettings(user.id).then(() => user);
        })
        .then((user) => {
            const token = generateToken({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            });

            res.status(201).json({
                message: "Account created successfully",
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                },
            });
        })
        .catch(next);
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = (req, res, next) => {
    const { email, password } = req.body;

    findUserByEmail(email)
        .then((user) => {
            if (!user || !validatePassword(password, user.salt, user.passwordHash)) {
                return Promise.reject({ status: 401, message: "Invalid email or password" });
            }

            const token = generateToken({
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            });

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                },
            });
        })
        .catch(next);
};

// ─── Me ───────────────────────────────────────────────────────────────────────

export const me = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    verifyToken(token)
        .then((decoded) => findUserById(decoded.id))
        .then((user) => {
            if (!user) {
                return Promise.reject({ status: 404, message: "User not found" });
            }

            res.status(200).json({
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    createdAt: user.createdAt,
                },
            });
        })
        .catch(next);
};