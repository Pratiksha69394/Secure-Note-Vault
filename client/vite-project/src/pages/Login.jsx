import { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", { email, password });
      login(res.data.token);
      navigate("/api/dashboard");
    } catch (err) {
      setError("Invalid credentials");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">N</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-center mb-8">Sign in to your account</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 text-white placeholder-slate-400 rounded-lg border border-slate-600/50 focus:border-blue-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-6"
            >
              <LogIn size={20} />
              Sign In
            </button>
          </form>

          <p className="text-center text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
