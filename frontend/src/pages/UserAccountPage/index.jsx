import { useState, useEffect } from "react";
import Button from "../../components/Button";
import "./style.css";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../AxiosInstance";

export default function UserAccountPage() {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(null);

  const [message, setMessage] = useState("");

  const [initialNome, setInitialNome] = useState("");
  const [initialEmail, setInitialEmail] = useState("");

  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState(initialNome);
  const [email, setEmail] = useState(initialEmail);
  const [cpf, setCpf] = useState("");

  const changeIsEdit = (e) => {
    if (isEdit !== null) {
      if (!nome) setNome(initialNome);
      if (!email) setEmail(initialEmail);
      setIsEdit(null);
    }
    setIsEdit(e);
  }

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axiosAuth.get("/api/usuario");
        if (response.data.sucesso) {
          const dadosUsuario = response.data.sucesso;
          setInitialNome(dadosUsuario.nome);
          setInitialEmail(dadosUsuario.email);
          setUsuario(dadosUsuario);
          setNome(dadosUsuario.nome);
          setEmail(dadosUsuario.email);
          setCpf(dadosUsuario.cpf);
        }
      } catch (error) {
        navigate("/login")
      }
    };

    verificarToken();
  }, [navigate]);

  const handleEdit = async (e) => {
    e.preventDefault();

    const usuario = { nome, email };

    try {
      const response = await axiosAuth.patch("/api/usuario", usuario);
      if (response.data.sucesso) {
        setNome(initialNome);
        setEmail(initialEmail);
        return navigate("/home")
      }
    } catch (erro) {
      if (erro.response && erro.response.data) {
        const message = erro.response.data.erro;
        setNome(initialNome);
        setEmail(initialEmail);
        return setMessage(message);
      }
    }

  }

  return (
    <div className="main">
      <NavBar />
      <div className="main-container">
        <div className="data-container">
          <div className="data-title">Dados</div>
          <hr />
          {message && <div className="message-field">{message}</div>}
          <form className="data-form" onSubmit={handleEdit}>
            <div className="data-field">
              {isEdit === "nome" ? <><div>Nome: </div><input type="text" className="data-input" value={nome} onChange={(e) => { setNome(e.target.value); setMessage(""); }} /><span className="edit" onClick={changeIsEdit}>✅</span></>
                :
                <div>Nome: {nome} <span className="edit" onClick={() => changeIsEdit("nome")}>✏️</span></div>}
            </div>
            <div className="data-field">
              {isEdit === "email" ? <><div>Email: </div><input type="email" className="data-input" value={email} onChange={(e) => { setEmail(e.target.value); setMessage(""); }} /><span className="edit" onClick={changeIsEdit}>✅</span></>
                :
                <div>Email: {email} <span className="edit" onClick={() => changeIsEdit("email")}>✏️</span></div>}
            </div>
            <div className="data-field">
              <div>CPF: {cpf}</div>
            </div>
            {((nome && nome !== initialNome) || (email && email !== initialEmail)) ? <Button type="submit">Salvar Alterações</Button> : <Button type="button" onClick={(e) => { e.preventDefault(); navigate("/home") }}>Voltar</Button>}
          </form>
        </div>
      </div>
    </div>
  );
}