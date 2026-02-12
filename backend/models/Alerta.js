import mongoose from "mongoose";

const alertaSchema = new mongoose.Schema({
  "titulo": { type: String, required: true },
  "descricao": { type: String, required: false },
  "comentarios": { type: Array, required: false },
  "data_postagem": { type: Date, required: true }
});

const Alerta = mongoose.model("alertas", alertaSchema);

export default Alerta;