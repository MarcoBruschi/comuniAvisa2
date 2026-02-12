import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  "nome": { type: String, required: true },
  "email": { type: String, required: true, unique: true },
  "hash": { type: String, required: true },
  "cpf": { type: String, required: true, unique: true },
  "roles": { type: Array, required: true }
});

const Usuario = mongoose.model("usuarios", usuarioSchema);

export default Usuario;