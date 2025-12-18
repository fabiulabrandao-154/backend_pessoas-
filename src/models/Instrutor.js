import mongoose from 'mongoose';

const instrutorSchema = new mongoose.Schema({
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
  especialidades: [{
    type: String
  }],
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

instrutorSchema.index({ nome: 'text' });

export default mongoose.model('Instrutor', instrutorSchema);
