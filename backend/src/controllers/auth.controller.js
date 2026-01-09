import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import  {logAudit}  from "../utils/auditLogger.js";


export const register = async (req,res)=>{
  const {name,email,password} = req.body;
  if(!name||!email||!password) return res.status(400).json({msg:"Missing fields"});

  if(await User.findOne({email})) return res.status(400).json({msg:"User exists"});

  const hash = await bcrypt.hash(password,10);
  await User.create({name,email,password:hash});
  res.json({msg:"Registered"});
};

// export const login = async (req,res)=>{
//   const user = await User.findOne({email:req.body.email});
//   if(!user) return res.status(400).json({msg:"Invalid creds"});

//   const ok = await bcrypt.compare(req.body.password, user.password);
//   if(!ok) return res.status(400).json({msg:"Invalid creds"});

//   const token = jwt.sign({id:user._id,role:user.role}, process.env.JWT_SECRET, {expiresIn:"1d"});

//   await logAudit(req, "LOGIN", req.user.id);

//   res.json({token});
// };


export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: "Invalid creds" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  if (!ok) return res.status(400).json({ msg: "Invalid creds" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  await logAudit(req, "LOGIN", user._id); // <-- FIXED

  res.json({ token });
};
