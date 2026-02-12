import Alerta from "../models/Alerta.js";

class AlertaController {

  async ListarAlertas(req, res) {
    try {
      const alertas = await Alerta.find({});
      return res.status(200).json({ sucesso: alertas });
    } catch (erro) {
      return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
    }
  }

  async ListarAlertaPorId(req, res) {
    try {
      const idAlerta = req.params.id;
      if (!idAlerta) return res.status(400).json({ erro: `Falha na consulta - um id é necessário` });
      const alertaEncontrado = await Alerta.findById(idAlerta);
      return res.status(200).json({ sucesso: alertaEncontrado });
    } catch (erro) {
      return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
    }
  }

  async PostarAlerta(req, res) {
    try {
      const { titulo, descricao, comentarios = [] } = req.body;
      if (!titulo) return res.status(400).json({ erro: "Falha ao postar alerta - título é obrigatório" });
      if (!comentarios) comentarios = [];
      const alerta = {
        titulo,
        descricao,
        comentarios: comentarios || [],
        data_postagem: new Date()
      };
      const novoAlerta = await Alerta.create(alerta);
      return res.status(201).json({ sucesso: novoAlerta });
    } catch (erro) {
      return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
    }
  }

}

export default new AlertaController();