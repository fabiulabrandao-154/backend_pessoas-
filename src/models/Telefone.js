import mongoose from "mongoose";

const TelefoneSchema = new mongoose.Schema({
  ddd: String,
  numero: String,
  pessoas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pessoa" }]
}, { timestamps: true });

export default mongoose.model("Telefone", TelefoneSchema);
