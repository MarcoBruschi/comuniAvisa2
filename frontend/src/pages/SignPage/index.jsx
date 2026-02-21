import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
import axios from "axios";
import axiosAuth from "../../AxiosInstance";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Footer from "../../components/Footer";

export default function SignPage() {

  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axiosAuth.get("/api/usuario");
        if (response.data.sucesso) navigate("/home");
      } catch (error) {
        navigate("/criarConta");
      }
    };

    verificarToken();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = {
      nome,
      email,
      senha,
      cpf
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_BASE}/api/usuario`, usuario);
      setNome("");
      setEmail("");
      setSenha("");
      setCpf("");
      if (response.data.sucesso) return navigate("/login");
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
          <div className="form-title">Criar Conta</div>
          {message && <div className="message-field">{message}</div>}
          <FormField>
            <label>Nome</label>
            <input type="text" required={true} onChange={(e) => { setNome(e.target.value); setMessage("") }} />
          </FormField>
          <FormField>
            <label>Email</label>
            <input type="email" required={true} onChange={(e) => { setEmail(e.target.value); setMessage("") }} />
          </FormField>
          <FormField>
            <label>Senha</label>
            <input type="password" required={true} onChange={(e) => { setSenha(e.target.value); setMessage("") }} />
          </FormField>
          <FormField>
            <label>CPF</label>
            <input type="text" required={true} onChange={(e) => { setCpf(e.target.value); setMessage("") }} />
          </FormField>
          <Button>Criar Conta</Button>
          <div className="login-span">Já possuí conta? <span onClick={() => navigate("/login")}>Fazer Login</span></div>
        </Form>
      </div>
    </div>
    <Footer/>
    </>
  );
}