import { useState } from "react";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/register", form);
      nav("/api/auth/login");
    } catch (err) {
      setError("Registration failed");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">Create Account</h2>
          <p className="text-slate-400 text-center mb-8">Join NotesFlow today</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg border border-slate-600/50 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg border border-slate-600/50 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg border border-slate-600/50 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
            >
              <UserPlus size={20} />
              Create Account
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}