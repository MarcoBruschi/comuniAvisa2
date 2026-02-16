import Button from "../../components/Button";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../AxiosInstance.js";

export default function CreatePostPage() {

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [tipoPost, setTipoPost] = useState(null);
  const [message, setMessage] = useState("");

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

  function renderPost() {
    switch (tipoPost) {
      case "alerta":
        return (
          <>
            <FormField>
              <label>Título</label>
              <input type="text" />
            </FormField>
            <FormField>
              <label>Descrição</label>
              <textarea></textarea>
            </FormField>
            <FormField>
              <Button>Postar</Button>
            </FormField>
          </>
        );
      default:
        return null;
    }
  }


  return (
    <div className="main">
      <NavBar>
        <Button type="button" onClick={() => navigate("/home")}>Voltar</Button>
      </NavBar>
      <div className="main-form">
        <Form>
          <div className="form-title">Criar Post</div>
          {message ?? <div className="message-field">{message}</div>}
          <hr />
          <FormField>
            <label>Tipo de Post</label>
            <div className="buttons">
              <Button onClick={(e) => { e.preventDefault(); handleTipo("alerta"); }}>Alerta</Button>
            </div>
          </FormField>
          {renderPost()}
        </Form>
      </div>
    </div>

  );
}