import { useState, useEffect } from "react";
import Button from "../../components/Button";
import "./style.css";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
import axiosAuth from "../../AxiosInstance";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Modal from "../../components/Modal";

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

  const [modal, setModal] = useState(false);

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

  const handleDelete = async (e) => {
    e.preventDefault(e);

    try {
      const response = await axiosAuth.delete("/api/usuario", {});
      return navigate("/");
    } catch (erro) {
      if (erro.response && erro.response.data) {
        const message = erro.response.data.erro;
        return setMessage(message);
      }
    }
  }

  return (
    <div className="main">
      {modal ? <Modal title="Deletar Conta">
        Tem certeza que deseja deletar sua conta?
        <div className="modal-buttons">
          <Button onClick={handleDelete}>Sim</Button>
          <Button onClick={(e) => { e.preventDefault(); setModal(false); }}>Não</Button>
        </div>
      </Modal> :
        ""}
      <NavBar>
        <Button type="button" onClick={() => navigate("/home")}>Voltar</Button>
      </NavBar>
      <div className="main-form">
        <Form onSubmit={handleEdit}>
          <div className="form-title">Dados</div>
          {message && <div className="message-field">{message}</div>}
          <hr />
          <FormField>
            {isEdit === "nome" ? <><label>Nome: </label><div className="formfield-edit"><input type="text" value={nome} onChange={(e) => { setNome(e.target.value); setMessage(""); }} /><span onClick={() => changeIsEdit(null)}>✅</span></div></>
              :
              <label>Nome: {nome} <span onClick={() => changeIsEdit("nome")}>✏️</span></label>}
          </FormField>
          <FormField>
            {isEdit === "email" ? <><label>Email: </label><div className="formfield-edit"><input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setMessage(""); }} /><span onClick={() => changeIsEdit(null)}>✅</span></div></>
              :
              <label>Email: {email} <span onClick={() => changeIsEdit("email")}>✏️</span></label>}
          </FormField>
          <FormField>
            <label>CPF: {cpf}</label>
          </FormField>
          <FormField className="formfield-buttons">
            {((isEdit === null) && ((nome && nome !== initialNome) || (email && email !== initialEmail))) ? <Button type="submit">Salvar Alterações</Button> : <Button type="button" onClick={(e) => { e.preventDefault(); setNome(initialNome); setEmail(initialEmail) }}>Desfazer</Button>}
            <Button onClick={(e) => { e.preventDefault(); setModal(true) }}>Deletar Conta</Button>
          </FormField>
        </Form>
      </div>
    </div>
  );
}