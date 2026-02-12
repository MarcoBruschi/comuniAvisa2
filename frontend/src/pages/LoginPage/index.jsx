import { useState } from "react";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import axios from "axios";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosAuth from "../../AxiosInstance";

export default function LoginPage() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axiosAuth.get("/api/usuario");
        if (response.data.sucesso) navigate("/home");
      } catch (error) {
        navigate("/login");
      }
    };

    verificarToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = {
      email,
      senha
    }

    try {
      const response = await axios.post(`${process.meta.env.VITE_URL_BASE}/api/auth/login`, usuario, { withCredentials: true });
      if (response.data.sucesso) {
        setEmail("");
        setSenha("");
        return navigate("/home");
      }
    } catch (erro) {
      if (erro.response && erro.response.data) {
        const message = erro.response.data.erro;
        return setMessage(message);
      }
    }

  }

  return (
    <div className="login">
      <NavBar />
      <div className="login-main">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-title">Login</div>
          <div className="form-fields-container">
            {message && <div className="message-field">{message}</div>}
            <div className="form-fields">
              <label>Email</label>
              <input type="email" required={true} onChange={(e) => { setEmail(e.target.value); setMessage("") }} />
            </div>
            <div className="form-fields">
              <label>Senha</label>
              <input type="password" required={true} onChange={(e) => { setSenha(e.target.value); setMessage("") }} />
            </div>
            <Button>Logar</Button>
            <div className="login-span">Não possuí conta? <span onClick={() => navigate("/criarConta")}>Criar Conta</span></div>
          </div>
        </form>
      </div>
    </div>
  );
}