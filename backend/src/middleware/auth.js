import { verifyToken } from "../utilis/jwt.js";

export const protect = (req, res, next) => {
  // ─── Step 1: Extract token ────────────────────────────────────────────
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  // ─── Step 2: Verify via util ──────────────────────────────────────────
  verifyToken(token)
    .then((decoded) => {
      req.user = decoded; // { id, email, fullName }
      next();
    })
    .catch(() => {
      return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
    });
};