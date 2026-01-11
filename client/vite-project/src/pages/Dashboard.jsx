import { useEffect, useState, useContext } from "react";
import { Plus, Trash2, Share2, Edit2, X, LogOut, Search, Clock } from "lucide-react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [activeTab, setActiveTab] = useState("my-notes");
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [sharePermission, setSharePermission] = useState("READ");
  const [showShareModal, setShowShareModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTimeline, setShowTimeline] = useState(true);

  // Load notes
  const loadMyNotes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/notes/my");
      setNotes(res.data);
    } catch (err) {
      setError("Failed to load notes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load shared notes
  const loadSharedNotes = async () => {
    try {
      console.log("Loading shared notes...");
      const res = await api.get("/notes/shared");
      console.log("Shared notes loaded:", res.data);
      setSharedNotes(res.data);
    } catch (err) {
      console.error("Error loading shared notes:", err.response?.data || err.message);
      setSharedNotes([]);
    }
  };

  // Load audit timeline
  const loadTimeline = async () => {
    try {
      const res = await api.get("/audit");
      setTimeline(res.data);
    } catch (err) {
      console.error("Error loading timeline:", err);
    }
  };

  useEffect(() => {
    loadMyNotes();
    loadSharedNotes();
    loadTimeline();

    // Refresh timeline every 30 seconds
    const interval = setInterval(loadTimeline, 30000);
    return () => clearInterval(interval);
  }, []);

  // Create or Update Note
  const handleCreateOrUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (selectedNote?._id) {
        // Update
        await api.put(`/notes/${selectedNote._id}`, { title, content });
      } else {
        // Create
        await api.post("/notes", { title, content });
      }

      resetForm();
      loadMyNotes();
      loadTimeline();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving note");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Note
  const handleDelete = async (id) => {
    if (window.confirm("Delete this note?")) {
      try {
        await api.delete(`/notes/${id}`);
        setNotes(notes.filter((n) => n._id !== id));
        if (selectedNote?._id === id) resetForm();
        loadTimeline();
      } catch (err) {
        setError("Error deleting note");
        console.error(err);
      }
    }
  };

  // Edit Note
  const handleEdit = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setError("");
  };

  // Reset Form
  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
    setError("");
  };

  // Share Note
  const handleShare = async () => {
    if (!shareEmail.trim()) {
      alert("Please enter an email");
      return;
    }

    if (!selectedNote || !selectedNote._id) {
      alert("Please select a note first");
      return;
    }

    try {
      console.log("Sharing note:", selectedNote._id, { usernameOrEmail: shareEmail, permission: sharePermission });
      const response = await api.post(`/notes/${selectedNote._id}/share`, { 
        usernameOrEmail: shareEmail,
        permission: sharePermission
      });
      console.log("Share response:", response);
      setShareEmail("");
      setSharePermission("READ");
      setShowShareModal(false);
      alert("Note shared successfully!");
      loadTimeline();
    } catch (err) {
      console.error("Share error details:", err.response?.data || err.message);
      alert("Error sharing note: " + (err.response?.data?.message || err.message));
    }
  };

  // Logout Handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Filter notes
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white">
              N
            </div>
            <h1 className="text-2xl font-bold text-white">NotesFlow</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("my-notes")}
            className={`pb-4 font-semibold transition ${
              activeTab === "my-notes"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            📋 My Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab("shared")}
            className={`pb-4 font-semibold transition ${
              activeTab === "shared"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            🔗 Shared ({sharedNotes.length})
          </button>
        </div>

        {/* My Notes Tab */}
        {activeTab === "my-notes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">
                      {selectedNote ? "Edit Note" : "Create Note"}
                    </h2>
                    {selectedNote && (
                      <button
                        onClick={resetForm}
                        className="text-slate-400 hover:text-slate-300"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Note title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-700/50 text-white placeholder-slate-500 rounded-lg px-4 py-3 border border-slate-600/50 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Content
                      </label>
                      <textarea
                        placeholder="Write your note..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="8"
                        className="w-full bg-slate-700/50 text-white placeholder-slate-500 rounded-lg px-4 py-3 border border-slate-600/50 focus:border-blue-500 focus:outline-none resize-none transition"
                      />
                    </div>

                    <button
                      onClick={handleCreateOrUpdate}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      {loading ? "Saving..." : selectedNote ? "Update Note" : "Create Note"}
                    </button>

                    {selectedNote && (
                      <button
                        onClick={resetForm}
                        className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-semibold py-3 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800/50 text-white placeholder-slate-500 rounded-lg px-12 py-3 border border-slate-700/50 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {loading && notes.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-slate-400">Loading notes...</p>
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-slate-400 text-lg">
                      {searchTerm ? "No notes found" : "No notes yet. Create one to get started!"}
                    </p>
                  </div>
                ) : (
                  filteredNotes.map((note) => (
                    <div
                      key={note._id}
                      className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-6 hover:border-blue-500/50 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleEdit(note)}
                        >
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                            {note.title}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(note)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-blue-400 transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedNote(note);
                              setShowShareModal(true);
                            }}
                            className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-cyan-400 transition"
                            title="Share"
                          >
                            <Share2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-300 line-clamp-2">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Shared Notes Tab */}
        {activeTab === "shared" && (
          <div>
            {sharedNotes.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-400 text-lg">No notes shared with you yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedNotes.map((note) => (
                  <div
                    key={note._id}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 p-6 hover:border-cyan-500/50 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-400">🔗 Shared by</span>
                      <span className="text-xs font-semibold text-cyan-400">
                        {note.sharedBy?.name || "User"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{note.title}</h3>
                    <p className="text-slate-300 text-sm line-clamp-3 mb-4">{note.content}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(note.sharedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Share Note</h3>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareEmail("");
                  setSharePermission("READ");
                }}
                className="text-slate-400 hover:text-slate-300"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-slate-300 mb-4">Enter email to share this note:</p>

            <input
              type="email"
              placeholder="user@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full bg-slate-700/50 text-white placeholder-slate-500 rounded-lg px-4 py-3 mb-4 border border-slate-600/50 focus:border-blue-500 focus:outline-none transition"
            />

            <div className="mb-6">
              <label className="text-slate-300 block mb-2">Permission:</label>
              <select
                value={sharePermission}
                onChange={(e) => setSharePermission(e.target.value)}
                className="w-full bg-slate-700/50 text-white rounded-lg px-4 py-3 border border-slate-600/50 focus:border-blue-500 focus:outline-none transition"
              >
                <option value="READ">Read Only</option>
                <option value="WRITE">Read & Write</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setShareEmail("");
                  setSharePermission("READ");
                }}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold transition"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {showTimeline && (
        <div className="fixed bottom-8 right-8 w-80 max-h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-blue-400" />
              <h3 className="text-white font-bold">Activity Timeline</h3>
            </div>
            <button
              onClick={() => setShowTimeline(false)}
              className="text-slate-400 hover:text-slate-300 transition"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-80">
            {timeline.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">No activity yet</p>
            ) : (
              timeline.map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-slate-300">{item.action || item.type}</p>
                    <p className="text-xs text-slate-500">
                      {item.timestamp
                        ? new Date(item.timestamp).toLocaleTimeString()
                        : "Just now"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}