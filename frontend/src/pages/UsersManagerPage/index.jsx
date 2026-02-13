import { useState, useEffect } from "react";
import axiosAuth from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Button from "../../components/Button";
import Card from "../../components/Card";
import "./style.css";

export default function UsersManagerPage() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [usuarios, setUsuarios] = useState([]);

  const [userEdit, setUserEdit] = useState({});
  const [userEditId, setUserEditId] = useState(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axiosAuth.get("/api/usuario");
        if (response.data.sucesso) {
          setUsuario(response.data.sucesso);
          const usersResponse = await axiosAuth.get("/api/admin/usuarios");
          if (usersResponse.data.sucesso) setUsuarios(usersResponse.data.sucesso);
        };
      } catch (error) {
        navigate("/login");
      }
    };

    verificarToken();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const response = await axiosAuth.delete(`/api/admin/usuarios/${id}`);
      if (response.data.sucesso) setUsuarios(prev => prev.filter(user => user._id !== id));
    } catch (erro) {
      if (erro.response && erro.response.data) {
        return;
      }
    }
  }

  const handleEdit = (user) => {
    if (userEdit === user) {
      setUserEdit({});
      setUserEditId(null);
    } else {
      setUserEdit(user);
      setUserEditId(user._id);
      setNome(user.nome);
      setEmail(user.email);
    }
  }

  const handleEditChanges = async (user) => {
    try {
      if (!nome || !email) return setMessage("Os campos devem ser preenchidos");
      const response = await axiosAuth.patch(`/api/admin/usuarios/${user._id}`, { nome, email });
      if (response.data.sucesso) {
        setUsuarios((prevUsuarios) => prevUsuarios.map((u) => u._id === user._id ? { ...u, nome, email } : u));
        handleEdit(user);
      }
    } catch (erro) {
      if (erro.response && erro.response.data) {
        const message = erro.response.data.erro;
        console.log(erro);
        return setMessage(message);
      }
    }
  }

  return (
    <div className="main">
      <NavBar>
        <Button type="button" onClick={() => navigate("/home")}>Voltar</Button>
      </NavBar>
      <div className="main-container">
        <div className="main-title">Usuarios</div>
        <hr className="line-usermanager" />
        {message && <div className="message-field">{message}</div>}
        {usuarios && usuarios.filter(user => !user.roles.includes("admin")).map((user, index) =>
          <Card className="card" key={index}>
            {userEditId == user._id ? <div className="card-text"><span className="card-title">Nome: <input type="text" className="edit-input" value={nome} onChange={(e) => { setNome(e.target.value); setMessage(""); }} /></span></div> :
              <div className="card-text"><span className="card-title">Nome: </span>{user.nome}</div>}
            {userEditId == user._id ? <div className="card-text"><span className="card-title">Email: <input type="text" className="edit-input" value={email} onChange={(e) => { setEmail(e.target.value); setMessage(""); }} /></span></div> :
              <div className="card-text"><span className="card-title">Email: </span>{user.email}</div>}
            <div className="card-text"><span className="card-title">CPF: </span>{user.cpf}</div>
            <div className="card-text options">
              <div className="roles">
                <div className="card-title">Roles:</div>
                {user.roles?.map((role, index) => <div key={index}>{role}</div>)}
              </div>
              <div className="buttons">
                {userEditId === user._id ? <><Button onClick={() => handleEditChanges(user)}>✅</Button><Button onClick={() => handleEdit(user)}>❌</Button></> :
                  <><Button onClick={() => handleEdit(user)}>✏️</Button><Button onClick={() => handleDelete(user._id)}>🗑️</Button></>}
              </div>
            </div>
          </Card>)}
      </div>
    </div>
  );
}