import mongoose from "mongoose";

const noteShareSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
  sharedWith: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permission: { type: String, enum: ["READ", "WRITE"], required: true }
}, { timestamps: true });

export default mongoose.model("NoteShare", noteShareSchema);
