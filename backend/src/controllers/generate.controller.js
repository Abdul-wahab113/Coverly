import { generateCoverLetter } from "../services/groqAi.js";
import {
    saveGeneration,
    getUserGenerations,
    getGenerationById,
    deleteGeneration,
} from "../services/generate.service.js";

// ─── Generate ─────────────────────────────────────────────────────────────────

export const generate = (req, res, next) => {
    const userId = req.user.id;
    const input = req.body;

    generateCoverLetter(input)
        .then((output) => saveGeneration(userId, input, output))
        .then((saved) => {
            res.status(201).json({
                message: "Generated successfully",
                generation: saved,
            });
        })
        .catch(next);
};

// ─── Get All Generations ──────────────────────────────────────────────────────

export const getAll = (req, res, next) => {
    getUserGenerations(req.user.id)
        .then((data) => res.status(200).json({ generations: data }))
        .catch(next);
};

// ─── Get Single Generation ────────────────────────────────────────────────────

export const getOne = (req, res, next) => {
    getGenerationById(req.params.id, req.user.id)
        .then((data) => res.status(200).json({ generation: data }))
        .catch(next);
};

// ─── Delete Generation ────────────────────────────────────────────────────────

export const remove = (req, res, next) => {
    deleteGeneration(req.params.id, req.user.id)
        .then(() => res.status(200).json({ message: "Deleted successfully" }))
        .catch(next);
};