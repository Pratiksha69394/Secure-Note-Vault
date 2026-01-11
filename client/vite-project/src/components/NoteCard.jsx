import { Edit, Trash2, Share2 } from "lucide-react";
import api from "../api/api";

export default function NoteCard({ note, onSelect, refresh, refreshNotes }) {
  const handleDelete = async () => {
    if (window.confirm("Delete this note?")) {
      await api.delete(`/api/notes/${note._id}`);
      refresh ? refresh() : refreshNotes();
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg group cursor-pointer"
      onClick={() => onSelect?.(note)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
            {note.title}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}>
          {note.isOwner && (
            <>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-blue-400 transition-colors">
                <Edit size={18} />
              </button>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-purple-400 transition-colors">
                <Share2 size={18} />
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-slate-300 line-clamp-2">{note.content}</p>
    </div>
  );
}
