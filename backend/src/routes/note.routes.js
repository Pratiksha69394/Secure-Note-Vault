import express from "express";
import { createNote, getMyNotes, getNote, updateNote, deleteNote, shareNote, getSharedNotes } from "../controllers/note.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* POST routes */
router.post("/", auth, createNote);

/* GET routes - more specific routes FIRST */
router.get("/my", auth, getMyNotes);
router.get("/shared", auth, getSharedNotes);

/* ID-specific routes LAST */
router.post("/:id/share", auth, shareNote);
router.get("/:id", auth, getNote);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);

export default router;
