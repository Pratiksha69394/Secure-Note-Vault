import React, { useState } from "react";
import api from "../api/api";

const ShareModal = ({ noteId, close }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
const [permission, setPermission] = useState("READ");

  const handleShare = async () => {
    await api.post(`/notes/${noteId}/share`, {
  usernameOrEmail,
  permission
});
  };


  return (
    <div style={{ background: "#eee", padding: "1rem" }}>
      <h3>Share Note</h3>
      <input
        placeholder="Username or Email"
        value={usernameOrEmail}
        onChange={(e) => setUsernameOrEmail(e.target.value)}
      />
      <select value={permission} onChange={(e) => setPermission(e.target.value)}>
        <option value="READ">READ</option>
        <option value="WRITE">WRITE</option>
      </select>
      <button onClick={handleShare}>Share</button>
      <button onClick={close}>Cancel</button>
    </div>
  );
};

export default ShareModal;
