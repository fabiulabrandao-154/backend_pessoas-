import mongoose from "mongoose";

const EnderecoSchema = new mongoose.Schema({
  cep: String,
  logradouro: String,
  bairro: String,
  cidade: String,
  uf: String,
  regiao: String,
  pessoas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pessoa" }]
}, { timestamps: true });

export default mongoose.model("Endereco", EnderecoSchema);
