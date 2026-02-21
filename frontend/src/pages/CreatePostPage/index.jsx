import Button from "../../components/Button";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../AxiosInstance.js";
import Footer from "../../components/Footer";


export default function CreatePostPage() {

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [tipoPost, setTipoPost] = useState(null);
  const [message, setMessage] = useState("");

  const [imagem, setImagem] = useState("");
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axiosAuth.get("/api/usuario");
        if (response.data.sucesso) setUsuario(response.data.sucesso);
      } catch (error) {
        navigate("/login");
      }
    };

    verificarToken();
  }, [navigate]);

  function handleTipo(tipo) {
    setTipoPost(prev => prev === tipo ? null : tipo);
  }

  const handlePost = async (tipo) => {

    const post = {
      imagem,
      titulo,
      descricao
    };

    try {
      const response = await axiosAuth.post(`/api/${tipo}`, post);
      if (response.data.sucesso) return navigate("/home");

    } catch (erro) {
      if (erro.response && erro.response.data) {
        const message = erro.response.data.erro;
        return setMessage(message);
      }
    }

  }

  function renderPost() {
    switch (tipoPost) {
      case "alertas":
        return (
          <>
            <FormField>
              <label>Imagem</label>
              <input type="text" onChange={(e) => { setImagem(e.target.value); setMessage(""); }}/>
            </FormField>
            <FormField>
              <label>Título</label>
              <input type="text" onChange={(e) => { setTitulo(e.target.value); setMessage(""); }} />
            </FormField>
            <FormField>
              <label>Descrição</label>
              <textarea onChange={(e) => { setDescricao(e.target.value); setMessage(""); }}></textarea>
            </FormField>
            <FormField>
              <Button onClick={(e) => { e.preventDefault(); handlePost("alertas"); }}>Postar</Button>
            </FormField>
          </>
        );
      default:
        return null;
    }
  }


  return (
    <>
    <div className="main">
      <NavBar>
        <Button type="button" onClick={() => navigate("/home")}>Voltar</Button>
      </NavBar>
      <div className="main-form">
        <Form>
          <div className="form-title">Criar Post</div>
          {message && <div className="message-field">{message}</div>}
          <hr />
          <FormField>
            <label>Tipo de Post</label>
            <div className="buttons">
              <Button onClick={(e) => { e.preventDefault(); handleTipo("alertas"); }}>Alerta</Button>
            </div>
          </FormField>
          {renderPost()}
        </Form>
      </div>
    </div>
    <Footer/>
    </>
  );
}