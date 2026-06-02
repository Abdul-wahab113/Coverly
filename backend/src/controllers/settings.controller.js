import {
    getUserSettings,
    updateUserSettings,
} from "../services/settings.service.js";

// ─── Get Settings ─────────────────────────────────────────────────────────────

export const getSettings = (req, res, next) => {
    getUserSettings(req.user.id)
        .then((settings) => res.status(200).json({ settings }))
        .catch(next);
};

// ─── Update Settings ──────────────────────────────────────────────────────────

export const updateSettings = (req, res, next) => {
    updateUserSettings(req.user.id, req.body)
        .then((settings) =>
            res.status(200).json({
                message: "Settings updated",
                settings,
            })
        )
        .catch(next);
};
