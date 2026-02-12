import Usuario from "../models/Usuario.js";
import RefreshToken from "../models/RefreshToken.js";
import bcrypt from "bcrypt";
import Functions from "../functions/Functions.js";

class AdminUsersController {

    async ListarUsuarios(req, res) {
        try {
            const usuarios = await Usuario.find({});
            return res.status(200).json({ sucesso: usuarios });
        } catch (erro) {
            return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
        }
    }

    async ListarUsuarioPorId(req, res) {
        try {
            const idUsuario = req.params.id;
            if (!idUsuario) return res.status(400).json({ erro: `Falha na consulta - um id é necessário` });
            const usuario = await Usuario.findById(idUsuario);
            return res.status(200).json({ sucesso: usuario });
        } catch (erro) {
            return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
        }
    }

    async CriarUsuario(req, res) {
        try {
            const { nome, email, senha, cpf, roles } = req.body;
            if (!nome || !email || !senha || !cpf) return res.status(400).json({ erro: "Falha ao criar usuário - todos os campos devem ser preenchidos" });
            if (!Functions.ValidarEmail(email)) return res.status(400).json({ erro: "Falha ao criar usuário - email inválido" });
            if (!Functions.ValidarSenha(senha)) return res.status(400).json({ erro: "Falha ao criar usuário - senha inválida, deve ter um caractere especial, uma letra maiúscula e minúscula, um número e pelo menos 8 caracteres" });
            if (!Functions.ValidarCpf(cpf)) return res.status(400).json({ erro: "Falha ao criar usuário - cpf inválido" });
            const emailExistente = await Usuario.findOne({ email });
            if (emailExistente) return res.status(400).json({ erro: "Falha ao criar usuário - esse email já está sendo usado" });
            const cpfExistente = await Usuario.findOne({ cpf });
            if (cpfExistente) return res.status(400).json({ erro: "Falha ao criar usuário - esse CPF já está sendo usado" });
            const cpfLimpo = cpf.replace(/\D/g, "");
            if (!roles && roles == []) roles = ["user"];
            const saltRounds = 12;
            const hash = await bcrypt.hash(senha, saltRounds);
            const usuario = {
                nome,
                email,
                hash,
                cpf: cpfLimpo,
                roles
            }
            await Usuario.create(usuario);
            return res.status(201).json({ sucesso: usuario });
        } catch (erro) {
            return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
        }
    }

    async AtualizarUsuario(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ erro: "É necessário informar um id" });
            const usuario = await Usuario.findById(id);
            if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

            const { novoNome, novoEmail } = req.body;

            if (novoEmail && !Functions.ValidarEmail(novoEmail)) return res.status(400).json({ erro: "E-mail inválido" });

            const alterados = {};
            if (novoNome && novoNome !== usuario.nome) alterados.nome = novoNome;
            if (novoEmail && novoEmail !== usuario.email) alterados.email = novoEmail;

            if (Object.keys(alterados).length === 0) return res.status(200).json({ sucesso: "Nenhuma alteração feira" });

            await Usuario.findOneAndUpdate({ _id: id },
                { $set: alterados },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ sucesso: "Usuário alterado com sucesso" });
        } catch (erro) {
            return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
        }
    }

    async DeletarUsuario(req, res) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ erro: "É necessário informar um id" });

            const usuario = await Usuario.findById(id);
            if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });
            
            await RefreshToken.deleteMany({ userID: id });
            await Usuario.findOneAndDelete({ _id: id });
            return res.status(200).json({ sucesso: "Usuário excluído com sucesso" });
        } catch (erro) {
            return res.status(500).json({ erro: `Falha no servidor - ${erro}` });
        }
    }

}

export default new AdminUsersController();