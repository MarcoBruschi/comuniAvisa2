import express from "express";
import connDb from "./config/conn.js";
import alertaRouter from "./routes/AlertasRoutes.js";
import adminUsersRouter from "./routes/AdminUsersRoutes.js";
import userRouter from "./routes/UserRoutes.js"
import authRouter from "./routes/AuthRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

await connDb();

app.use(express.json());
const isProduction = process.env.NODE_ENV === 'production';
app.use(cors({
  origin: isProduction ? process.env.FRONTEND_URL : "http://localhost:5173",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

app.use(cookieParser(process.env.COOKIE_KEY));

app.use(authRouter);
app.use(adminUsersRouter);
app.use(userRouter);
app.use(alertaRouter);

app.get("/", (req, res) => res.status(200).send("Ok"));

export default app;