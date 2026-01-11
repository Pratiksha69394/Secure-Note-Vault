import React, { useEffect, useState } from "react";
import api from "../api/api";
import NoteCard from "../components/NoteCard";
import Layout from "./Layout";

const SharedNotes = () => {
  const [notes, setNotes] = useState([]);

  const fetchShared = async () => {
    const res = await api.get("/api/notes/shared");
    setNotes(res.data);
  };

  useEffect(() => {
    fetchShared();
  }, []);

  return (
    <Layout>
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Shared Notes</h2>
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No notes shared with you yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={{ ...note, isOwner: false }}
                refreshNotes={fetchShared}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SharedNotes;
