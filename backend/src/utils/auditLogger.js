import AuditLog from "../models/AuditLog.js";

export const logAudit = async (req, action, target = "") => {
  await AuditLog.create({
    user: req.user?.id,
    action,
    target,
    ip: req.ip
  });
};
