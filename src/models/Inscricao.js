import mongoose from 'mongoose';

const inscricaoSchema = new mongoose.Schema({
  aluno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Aluno',
    required: true
  },
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  data_inscricao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

inscricaoSchema.index({ aluno: 1, curso: 1 }, { unique: true });

export default mongoose.model('Inscricao', inscricaoSchema);
