import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import morgan from "morgan";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// ensure logs directory exists and setup request logging
const logsDir = new URL("../logs", import.meta.url).pathname;
fs.mkdirSync(logsDir, { recursive: true });
const logFile = new URL("../logs/server.log", import.meta.url).pathname;
const accessLogStream = fs.createWriteStream(logFile, { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req,res)=>res.send("Secure Notes Vault API running"));

/* Swagger setup */
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Secure Notes Vault API",
			version: "1.0.0",
			description: "API for user auth and encrypted notes with sharing"
		},
		servers: [
			{ url: `http://localhost:${process.env.PORT || 5000}/api` }
		]
	},
	apis: ["./src/routes/*.js", "./src/controllers/*.js"]
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/audit", auditRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));

