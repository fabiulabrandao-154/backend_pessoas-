import mongoose from 'mongoose';

const cursoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  carga_horaria: {
    type: Number,
    required: true,
    min: 1
  },
  instrutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instrutor',
    required: true
  }
}, {
  timestamps: true
});

cursoSchema.index({ titulo: 'text' });

export default mongoose.model('Curso', cursoSchema);
