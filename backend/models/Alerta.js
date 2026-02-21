import mongoose from "mongoose";

const alertaSchema = new mongoose.Schema({
  "imagem": { type: String, required: false},
  "titulo": { type: String, required: true },
  "descricao": { type: String, required: false },
  "comentarios": { type: Array, required: false },
  "data_postagem": { type: Date, required: true },
  "user": { type: Object, required: true },
  "tipo": { type: String, required: true }
});

const Alerta = mongoose.model("alertas", alertaSchema);

export default Alerta;