import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";

dns.setServers(['1.1.1.1', '8.8.8.8']);

dotenv.config();

async function connDb () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Banco conectado com sucesso");
    return mongoose.connection;
  } catch (error) {
    console.error("Erro ao conectar com Banco:", error.message);
  }
}

export default connDb;