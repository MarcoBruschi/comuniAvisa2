import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Functions from "../functions/Functions.js";
import RefreshToken from "../models/RefreshToken.js";
import Usuario from "../models/Usuario.js";
import Blacklist from "../models/BlackList.js";

class AuthController {

  async LogarUsuario(req, res) {
    try {
      const { email, senha } = req.body;

      if (!Functions.ValidarEmail(email)) return res.status(400).json({ erro: "Falha ao fazer login - email inválido" });
      if (!Functions.ValidarSenha(senha)) return res.status(400).json({ erro: "Falha ao fazer login - senha inválida" });

      const usuario = await Usuario.findOne({ email });
      if (!usuario) return res.status(404).json({ erro: "Falha ao fazer login - usuário não encontrado" });

      const verificarSenha = await bcrypt.compare(senha, usuario.hash);
      if (!verificarSenha) return res.status(400).json({ erro: "Falha ao fazer login - dados inválidos " });

      const accessToken = jwt.sign({ id: usuario.id, username: usuario.nome, role: usuario.roles },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: '10m' }
      );

      const refreshToken = jwt.sign({ id: usuario.id, username: usuario.nome, role: usuario.roles },
        process.env.REFRESH_SECRET_KEY,
        { expiresIn: '7d' }
      );

      const saultRounds = 12;
      const refreshTokenHash = await bcrypt.hash(refreshToken, saultRounds);
      const refreshTokenBanco = new RefreshToken({
        userId: usuario.id,
        tokenHash: refreshTokenHash,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        revoked: false
      });

      await refreshTokenBanco.save();

      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
      });

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'None' : 'Lax',
        maxAge: 10 * 60 * 1000,
        path: "/"
      });

      return res.status(200).json({ sucesso: "Login feito com sucesso" });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" + erro });
    }
  }

  async AtualizarToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(401);

      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      } catch (err) {
        return res.sendStatus(403);
      }


      const tokensDoUsuario = await RefreshToken.find({ userId: decoded.id });
      if (!tokensDoUsuario.length) return res.sendStatus(403);

      let tokenValido = false;
      for (const t of tokensDoUsuario) {
        if (await bcrypt.compare(refreshToken, t.tokenHash)) {
          tokenValido = true;
          break;
        }
      }

      if (!tokenValido) return res.sendStatus(403);

      const usuario = await Usuario.findById(decoded.id);
      if (!usuario) return res.sendStatus(403);

      const novoAccessToken = jwt.sign(
        { id: usuario.id, username: usuario.nome, role: usuario.roles },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: '15m' }
      );

      res.cookie('accessToken', novoAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 10 * 60 * 1000,
        path: "/"
      });
      return res.status(200).json({ sucesso: novoAccessToken });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

  async LogoutUsuario(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.sendStatus(401);

      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
      } catch {
        return res.sendStatus(401);
      }

      const tokens = await RefreshToken.find({ userId: decoded.id });
      if (!tokens.length) return res.sendStatus(404);

      let tokenDb = null;
      for (const t of tokens) {
        if (await bcrypt.compare(refreshToken, t.tokenHash)) {
          tokenDb = t;
          break;
        }
      }

      if (tokenDb) await RefreshToken.deleteOne({ userId: decoded.id });
      if (!tokenDb) return res.sendStatus(401);

      const accessToken = req.cookies.accessToken;
      if (!accessToken) return res.sendStatus(400);

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const blackList = await Blacklist.create({ token: accessToken, expiresAt });
      if (!blackList) return res.sendStatus(500);

      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      return res.status(200).json({ sucesso: "Logout feito com sucesso" });
    } catch (erro) {
      return res.status(500).json({ erro: "Falha no servidor" });
    }
  }

}

export default new AuthController();