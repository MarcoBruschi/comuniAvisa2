import { useState } from "react";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosAuth from "../../AxiosInstance";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Footer from "../../components/Footer";

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
      const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/api/auth/login`, usuario, { withCredentials: true });
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
    <>
      <div className="main">
        <NavBar />
        <div className="main-form">
          <Form onSubmit={handleSubmit}>
            <div className="form-title">Login</div>
            {message && <div className="message-field">{message}</div>}
            <FormField>
              <label>Email</label>
              <input type="email" required={true} onChange={(e) => { setEmail(e.target.value); setMessage("") }} />
            </FormField>
            <FormField>
              <label>Senha</label>
              <input type="password" required={true} onChange={(e) => { setSenha(e.target.value); setMessage("") }} />
            </FormField>
            <Button>Logar</Button>
            <div className="login-span">Não possuí conta? <span onClick={() => navigate("/criarConta")}>Criar Conta</span></div>
          </Form>
        </div>
      </div>
      <Footer/>
    </>
  );
}