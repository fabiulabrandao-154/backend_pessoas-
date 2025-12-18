import mongoose from 'mongoose';

const alunoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
    maxlength: 11
  },
  data_nascimento: {
    type: Date
  },
  matricula: {
    type: String,
    required: true,
    unique: true
  },
  data_cadastro: {
    type: Date,
    default: Date.now
  },
  endereco: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Endereco'
  },
  telefones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Telefone'
  }]
}, {
  timestamps: true
});

alunoSchema.index({ nome: 'text' });

export default  mongoose.model('Aluno', alunoSchema);
