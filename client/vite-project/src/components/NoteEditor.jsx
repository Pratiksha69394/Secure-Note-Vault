import { useState, useEffect } from "react";
import api from "../api/api";
import { Save, X } from "lucide-react";

export default function NoteEditor({ note, onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [note]);

  const handleSave = async () => {
    if (!title || !content) return alert("Fill all fields");
    
    if (note?._id) {
      await api.put(`/api/notes/${note._id}`, { title, content });
    } else {
      await api.post("/api/notes", { title, content });
    }
    
    setTitle("");
    setContent("");
    onSaved();
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">
          {note ? "Edit Note" : "Create Note"}
        </h3>
        {note && (
          <button className="text-slate-400 hover:text-slate-300">
            <X size={20} />
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="Note title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-3 mb-4 border border-slate-600/50 focus:border-blue-500 focus:outline-none transition-colors"
      />
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="8"
        className="w-full bg-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-3 mb-4 border border-slate-600/50 focus:border-blue-500 focus:outline-none resize-none transition-colors"
      />
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {note ? "Update" : "Create"} Note
      </button>
    </div>
  );
}

