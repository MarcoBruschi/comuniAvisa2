import Alerta from "../models/Alerta.js";
import jwt from "jsonwebtoken";
import Functions from "../functions/Functions.js";

class AlertaController {

  async ListarAlertas(req, res) {
    try {
      const alertas = await Alerta.find({});
      return res.status(200).json({ sucesso: alertas });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

  async ListarAlertaPorId(req, res) {
    try {
      const idAlerta = req.params.id;
      if (!idAlerta) return res.status(400).json({ erro: `Falha na consulta - um id é necessário` });
      const alertaEncontrado = await Alerta.findById(idAlerta);
      return res.status(200).json({ sucesso: alertaEncontrado });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

  async PostarAlerta(req, res) {
    try {

      const token = req.cookies.accessToken;
      if (!token) return res.sendStatus(401);

      let decoded;
      try {
      decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
      } catch (erro) {
        return res.sendStatus(403);
      }
      
      const { imagem, titulo, descricao, comentarios = [] } = req.body;
      const imagemValida = await Functions.ValidarImagem(imagem);
      if (!imagemValida) return res.status(400).json({ erro: "Falha ao postar alerta - a imagem enviada não é válida" });
      if (!titulo) return res.status(400).json({ erro: "Falha ao postar alerta - título é obrigatório" });
      if (!comentarios) comentarios = [];

      const alerta = {
        imagem,
        titulo,
        descricao,
        comentarios: comentarios || [],
        data_postagem: new Date(),
        user: {userId: decoded.id, userName: decoded.username},
        tipo: "Alerta"
      };

      const novoAlerta = await Alerta.create(alerta);
      return res.status(201).json({ sucesso: novoAlerta });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

}

export default new AlertaController();