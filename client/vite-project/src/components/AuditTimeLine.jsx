import { useEffect, useState } from "react";
import api from "../api/api";

export default function AuditTimeline() {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await api.get("/api/audit");
        setTimeline(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimeline();
  }, []);

  return (
    <div className="fixed bottom-8 right-8 w-80 max-h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 px-6 py-4 border-b border-slate-700/50">
        <h3 className="text-white font-bold">Activity Timeline</h3>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto max-h-80">
        {timeline.length === 0 ? (
          <p className="text-slate-400 text-sm">No activity yet</p>
        ) : (
          timeline.map((item, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-slate-300">{item.action}</p>
                <p className="text-xs text-slate-500">{item.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
