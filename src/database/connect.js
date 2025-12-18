import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
  try {
    console.log('🔍 URI do Mongo:', process.env.MONGO_URI=mongodb+srv://titafabiula1_db_user:<evpDR2UhR36GPeWo>@cluster0.bdvr7cd.mongodb.net/?appName=Cluster0);
    await mongoose.connect(process.env.MONGO_URI=mongodb+srv://titafabiula1_db_user:<evpDR2UhR36GPeWo>@cluster0.bdvr7cd.mongodb.net/?appName=Cluster0);
    console.log('✅ MongoDB conectado com sucesso!');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', err.message);
  }
}


