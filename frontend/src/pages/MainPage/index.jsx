import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import NavBar from "../../components/NavBar";
import "./style.css";
import Button from "../../components/Button";
import Card from "../../components/Card";
import logo from '../../assets/logoComuniAvisa.png';
import axiosAuth from "../../AxiosInstance.js";
import eyeIcon from "../../assets/eyeIcon.svg";
import bulbIcon from "../../assets/bulbIcon.svg";
import Footer from "../../components/Footer/index.jsx";

export default function MainPage() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosAuth.post(`/api/auth/logout`, {});
      if (response.data.sucesso) {
        setUsuario("");
        navigate("/");
      }
    } catch (erro) {
      navigate("/");
    }
  }

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

  return (
    <>
    <div className="main">
      <NavBar>
        {usuario?.roles.includes("admin") ? <div className="buttons-middle">
          <Button onClick={() => navigate("/home/dados")}>Gerenciar Perfil</Button>
          <Button onClick={() => navigate("/home/admin/usuarios")}>Gerenciar Usuários</Button>
        </div> : <Button onClick={() => navigate("/home/dados")}>Gerenciar Perfil</Button>}
        <Button onClick={handleLogout}>Logout</Button>
      </NavBar>
      <div className="main-content">
        <div className="main-welcome">
          <div>
            <div className="welcome-text">Bem-vindo!</div>
            {usuario && <div className="user-greeting">Olá <div className="user-name">{usuario.nome}</div>, bem vindo ao <span>ComuniAvisa</span>.</div>}
          </div>
          <img className="logo-img" src={logo} alt="logo" width="400" height="460"/>
        </div>

        <div className="main-section">
          <div className="main-section-title">O que deseja fazer?</div>
          <hr />
          <div className="cards-container">
            <Card className="card">
              <div className="card-title"><img src={eyeIcon} alt="Olho ícone" />Ver Postagens</div>
              <div className="card-text">Explore postagens da comunidade</div>
              <Button onClick={() => navigate("/home/posts")}>Acessar</Button>
            </Card>
            <Card className="card">
              <div className="card-title"><img src={bulbIcon} alt="Lâmpada ícone" />Criar Postagem</div>
              <div className="card-text">Configure alertas e outros para a comunidade</div>
              <Button onClick={() => navigate("/home/criarPost")}>Criar</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

