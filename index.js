import express from 'express';
import cors from 'cors';
import { connectDB } from './src/database/connect.js';
import alunoRoutes from './src/routes/alunoRoutes.js';
import cursoRoutes from './src/routes/cursoRoutes.js';
import instrutorRoutes from './src/routes/instrutorRoutes.js';
import inscricaoRoutes from './src/routes/inscricaoRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Conecta ao MongoDB
connectDB();

// Rotas
app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);
app.use('/instrutores', instrutorRoutes);
app.use('/inscricoes', inscricaoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
