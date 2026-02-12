import express from "express";
import AlertaController from "../controllers/AlertasController.js";
import Functions from "../functions/Functions.js";

const router = express.Router();

router.get("/api/alertas", Functions.AutenticarToken, (req, res) => AlertaController.ListarAlertas(req, res));
router.get("/api/alertas/:id", Functions.AutenticarToken, (req, res) => AlertaController.ListarAlertaPorId(req, res));
router.post("/api/alertas", Functions.AutenticarToken, (req, res) => AlertaController.PostarAlerta(req, res));

export default router;