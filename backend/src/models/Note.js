import mongoose from "mongoose";
import CryptoJS from "crypto-js";

const noteSchema = new mongoose.Schema({
  title: String,
  content: String, // this will be AES encrypted
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  visibility: { type: String, enum: ["PRIVATE","SHARED"], default: "PRIVATE" },
  shares: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    permission: { type: String, enum: ["READ","WRITE"] }
  }]
}, { timestamps:true });

// const noteSchema = new mongoose.Schema({
//   userId: mongoose.Schema.Types.ObjectId,
//   title: String,
//   content: String
// });

// // encrypt before save
// noteSchema.pre("save", function(next){
//   this.content = CryptoJS.AES.encrypt(this.content, process.env.NOTE_SECRET).toString();
//   next();
// });

// // decrypt on fetch
// noteSchema.methods.decrypt = function(){
//   const bytes = CryptoJS.AES.decrypt(this.content, process.env.NOTE_SECRET);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };


export default mongoose.model("Note", noteSchema);
