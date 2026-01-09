import express from "express";
import AuditLog from "../models/AuditLog.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req,res)=>{
  const logs = await AuditLog.find({ user:req.user.id }).sort({createdAt:-1});
  res.json(logs);
});

export default router;
