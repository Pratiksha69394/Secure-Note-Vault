import Note from "../models/Note.js";
import NoteShare from "../models/NoteShare.js";
import User from "../models/User.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { logAudit } from "../utils/auditLogger.js";
import mongoose from "mongoose";

/* CREATE */
export const createNote = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ msg: "Missing fields" });

  const note = await Note.create({
    title,
    content: encrypt(content),
    owner: req.user.id
  });

  await logAudit(req, "CREATE_NOTE", note._id);

  res.json({ ...note.toObject(), content });
};

/* GET MY NOTES */
export const getMyNotes = async (req, res) => {
  const notes = await Note.find({ owner: req.user.id });

  const decrypted = notes.map(n => ({
    ...n.toObject(),
    content: decrypt(n.content)
  }));

  res.json(decrypted);
};

/* GET SHARED NOTES */
export const getSharedNotes = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const shares = await NoteShare.find({ sharedWith: req.user.id }).populate("noteId").lean();

    if (!shares || shares.length === 0) {
      return res.json([]);
    }

    const notes = shares
      .filter(s => s.noteId) // skip if note is deleted
      .map(s => ({
        _id: s.noteId._id,
        title: s.noteId.title,
        content: decrypt(s.noteId.content),
        owner: s.noteId.owner,
        permission: s.permission,
        isOwner: false,
        sharedAt: s._id ? s._id.getTimestamp?.() : new Date()
      }));

    res.json(notes);
  } catch (err) {
    console.error("Error in getSharedNotes:", err);
    res.status(500).json({ message: "Server error while fetching shared notes", error: err.message });
  }
};


/* GET ONE NOTE */
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user is the owner
    if (note.owner.toString() === req.user.id) {
      return res.json({ 
        ...note.toObject(), 
        content: decrypt(note.content) 
      });
    }

    // Check if note is shared with user
    const share = await NoteShare.findOne({
      noteId: id,
      sharedWith: req.user.id
    });

    if (!share) {
      return res.status(403).json({ message: "You don't have access to this note" });
    }

    await logAudit(req, "READ_NOTE", id);

    res.json({ 
      ...note.toObject(), 
      content: decrypt(note.content),
      permission: share.permission,
      isOwner: false
    });
  } catch (err) {
    console.error("Error in getNote:", err);
    res.status(500).json({ message: "Server error while fetching note" });
  }
};

/* SHARE */
export const shareNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { usernameOrEmail, permission } = req.body;

    // Validate permission
    if (!["READ", "WRITE"].includes(permission)) {
      return res.status(400).json({ message: "Invalid permission. Must be READ or WRITE" });
    }

    // Check if note exists
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check if user is the owner
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only share your own notes" });
    }

    // Find user by email or name
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { name: usernameOrEmail }]
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already shared
    const existingShare = await NoteShare.findOne({
      noteId: id,
      sharedWith: user._id
    });

    if (existingShare) {
      return res.status(400).json({ message: "This note is already shared with this user" });
    }

    // Create share
    await NoteShare.create({
      noteId: id,
      sharedWith: user._id,
      permission
    });

    await logAudit(req, "SHARE_NOTE", id);

    res.json({ message: "Note shared successfully" });
  } catch (err) {
    console.error("Error in shareNote:", err);
    res.status(500).json({ message: "Server error while sharing note" });
  }
};

/* UPDATE */
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Check if user is the owner
    if (!note.owner.equals(req.user.id)) {
      // Check if shared with WRITE permission
      const share = await NoteShare.findOne({
        noteId: note._id,
        sharedWith: req.user.id,
        permission: "WRITE"
      });
      if (!share) return res.status(403).json({ message: "You don't have permission to edit this note" });
    }

    if (req.body.title) note.title = req.body.title;
    if (req.body.content) note.content = encrypt(req.body.content);
    
    await logAudit(req, "UPDATE_NOTE", note._id);

    await note.save();
    res.json({ ...note.toObject(), content: decrypt(note.content) });
  } catch (err) {
    console.error("Error in updateNote:", err);
    res.status(500).json({ message: "Server error while updating note" });
  }
};

/* DELETE */
export const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.sendStatus(404);

  await logAudit(req, "DELETE_NOTE", note._id);

  if (note.owner.equals(req.user.id) || req.user.role === "ADMIN") {
    await note.deleteOne();
    return res.json({ msg: "Deleted" });
  }

  res.sendStatus(403);
};




