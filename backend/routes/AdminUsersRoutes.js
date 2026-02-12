import express from "express";
import AdminUsersController from "../controllers/AdminUsersController.js";
import Functions from "../functions/Functions.js";

const router = express.Router();

router.get("/api/admin/usuarios", Functions.AutenticarToken, Functions.Autorizar(["admin"]), (req, res) => AdminUsersController.ListarUsuarios(req, res));
router.get("/api/admin/usuarios/:id", Functions.AutenticarToken, Functions.Autorizar(["admin"]), (req, res) => AdminUsersController.ListarUsuarioPorId(req, res));
router.post("/api/admin/usuarios", Functions.AutenticarToken, Functions.Autorizar(["admin"]), (req, res) => AdminUsersController.CriarUsuario(req, res));
router.patch("/api/admin/usuarios/:id", Functions.AutenticarToken, Functions.Autorizar(["admin"]), (req, res) => AdminUsersController.AtualizarUsuario(req, res));
router.delete("/api/admin/usuarios/:id", Functions.AutenticarToken, Functions.Autorizar(["admin"]), (req, res) => AdminUsersController.DeletarUsuario(req, res));

export default router;