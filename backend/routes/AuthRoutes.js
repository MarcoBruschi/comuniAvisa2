import express from "express";
import AuthController from "../controllers/AuthController.js";
import Functions from "../functions/Functions.js";

const router = express.Router();

router.post("/api/auth/login", (req, res) => AuthController.LogarUsuario(req, res));
router.post("/api/auth/refreshToken", (req, res) => AuthController.AtualizarToken(req, res));
router.post("/api/auth/logout", Functions.AutenticarToken, (req, res) => AuthController.LogoutUsuario(req, res));

export default router;