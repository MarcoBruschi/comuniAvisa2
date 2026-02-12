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
  const [id, setId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axiosAuth.get("/api/usuario");
        if (response.data.sucesso) {
          setUsuario(response.data.sucesso)
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

  return (
    <div className="main">
      <NavBar>
        <Button type="button" onClick={() => navigate("/home")}>Voltar</Button>
      </NavBar>
      <div className="main-container">
        <div className="main-title">Usuarios</div>
        <hr className="line-usermanager" />
        {usuarios && usuarios.filter(user => !user.roles.includes("admin")).map((user, index) =>
          <Card className="card" key={index} data-id={user.id}>
            <div className="card-text"><span className="card-title">Nome: </span>{user.nome}</div>
            <div className="card-text"><span className="card-title">Email: </span>{user.email}</div>
            <div className="card-text"><span className="card-title">CPF: </span>{user.cpf}</div>
            <div className="card-text options">
              <div className="roles">
                <div className="card-title">Roles:</div>
                {user.roles?.map((role, index) => <div key={index}>{role}</div>)}
              </div>
              <div className="buttons">
                <Button>✏️</Button>
                <Button onClick={() => handleDelete(user._id)}>🗑️</Button>
              </div>
            </div>
          </Card>)}
      </div>
    </div>
  );
}