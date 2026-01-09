import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import auditRoutes from "./routes/audit.routes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>res.send("Secure Notes Vault API running"));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/audit", auditRoutes);

app.listen(5000, ()=>console.log("Server running on 5000"));

