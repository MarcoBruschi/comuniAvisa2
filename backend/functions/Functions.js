import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import Blacklist from "../models/BlackList.js";

class Functions {
    ValidarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    ValidarSenha(senha) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
        return regex.test(senha);
    }

    ValidarCpf(cpf) {

        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf[i]) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf[i]) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[10])) return false;

        return true;
    }

    async AutenticarToken(req, res, next) {
        const token = req.cookies.accessToken;

        if (!token) return res.sendStatus(401);
        const blacklisted = await Blacklist.findOne({token: token})
        if (blacklisted) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_SECRET_KEY, (erro, usuario) => {
            if (erro) return res.sendStatus(403);
            req.usuario = usuario;
            next();
        });
    }

    Autorizar(rolesAutorizadas) {
        return async (req, res, next) => {
            const token = req.cookies.accessToken;
            if (!token) return res.sendStatus(401);

            const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
            const usuario = await Usuario.findById(decoded.id);
            if (!usuario) return res.sendStatus(403);

            
            const permissao = usuario.roles.some(role => rolesAutorizadas.includes(role));
            if (!permissao) return res.sendStatus(403);

            req.user = usuario;
            next();
        };
    }
}

export default new Functions();