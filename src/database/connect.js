import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    console.log('🔍 URI do Mongo:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
  }
}
