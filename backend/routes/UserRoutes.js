import Functions from "../functions/Functions.js";
import UserController from "../controllers/UserController.js";
import express from "express";

const router = express.Router();

router.get("/api/usuario", Functions.AutenticarToken, (req, res) => UserController.ListarDados(req, res));
router.post("/api/usuario", (req, res) => UserController.CriarConta(req, res));
router.patch("/api/usuario", Functions.AutenticarToken, (req, res) => UserController.AlterarDadosDaConta(req, res));
router.delete("/api/usuario", Functions.AutenticarToken, (req, res) => UserController.DeletarConta(req, res));

export default router;