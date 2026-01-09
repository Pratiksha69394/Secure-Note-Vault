import { useState } from 'react'
import './index.css' 
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SharedNotes from "./pages/SharedNotes";
import AuthProvider from "./context/AuthContext";

function App() {

  return (
        <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shared" element={<SharedNotes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App



