import Usuario from "../models/Usuario.js";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Functions from "../functions/Functions.js";
import bcrypt from "bcrypt";
import Blacklist from "../models/BlackList.js";
dotenv.config();

class UserController {

  async ListarDados(req, res) {
    try {
      const token = req.cookies.accessToken;
      if (!token) return res.sendStatus(401);

      const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

      const usuario = await Usuario.findById(decoded.id);
      if (!usuario) return res.sendStatus(404);

      const { hash, ...usuarioSemHash } = usuario.toObject();

      return res.status(200).json({ sucesso: usuarioSemHash });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

  async CriarConta(req, res) {
    try {
      const { nome, email, senha, cpf } = req.body;
      if (!nome || !email || !senha || !cpf) return res.status(400).json({ erro: "Falha ao criar usuário - todos os campos devem ser preenchidos" });

      if (!Functions.ValidarEmail(email)) return res.status(400).json({ erro: "Falha ao criar usuário - email inválido" });
      if (!Functions.ValidarSenha(senha)) return res.status(400).json({ erro: "Falha ao criar usuário - senha inválida, deve ter um caractere especial, uma letra maiúscula e minúscula, um número e pelo menos 8 caracteres" });
      if (!Functions.ValidarCpf(cpf)) return res.status(400).json({ erro: "Falha ao criar usuário - cpf inválido" });

      const emailExistente = await Usuario.findOne({ email });
      if (emailExistente) return res.status(400).json({ erro: "Falha ao criar usuário - esse email já está sendo usado" });

      const cpfLimpo = cpf.replace(/\D/g, "");
      const cpfExistente = await Usuario.findOne({ cpf: cpfLimpo });
      if (cpfExistente) return res.status(400).json({ erro: "Falha ao criar usuário - esse CPF já está sendo usado" });

      const roles = ["user"];
      const saltRounds = 12;
      const hash = await bcrypt.hash(senha, saltRounds);
      const usuario = {
        nome,
        email,
        hash,
        cpf: cpfLimpo,
        roles
      }
      const usuarioCriado = await Usuario.create(usuario);
      const { hash: _, ...usuarioSemHash } = usuarioCriado.toObject();
      return res.status(201).json({ sucesso: usuarioSemHash });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

  async AlterarDadosDaConta(req, res) {
    try {
      const token = req.cookies.accessToken;
      if (!token) return res.sendStatus(401);

      const decode = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
      const id = decode.id;

      const usuario = await Usuario.findById(id);
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

      const { nome, email } = req.body;

      if (email && !Functions.ValidarEmail(email)) return res.status(400).json({ erro: "E-mail inválido" });

      const alterados = {};
      if (nome && nome !== usuario.nome) alterados.nome = nome;
      if (email && email !== usuario.email) alterados.email = email;

      if (Object.keys(alterados).length === 0) return res.status(200).json({ sucesso: "Nenhuma alteração feira" });

      await Usuario.findOneAndUpdate({ _id: id },
        { $set: alterados },
        { new: true, runValidators: true }
      );

      return res.status(200).json({ sucesso: "Usuário alterado com sucesso" });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

  async DeletarConta(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) return res.sendStatus(401);

      const decode = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
      const id = decode.id;

      const usuario = await Usuario.findById(id);
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

      await RefreshToken.deleteMany({ userId: id });
      await Usuario.findOneAndDelete({ _id: id });
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(401);

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      const blackList = await Blacklist.create({ token: accessToken, expiresAt });
      if (!blackList) return res.sendStatus(500);

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.status(200).json({ sucesso: "Usuário excluído com sucesso" });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

}

export default new UserController(); 