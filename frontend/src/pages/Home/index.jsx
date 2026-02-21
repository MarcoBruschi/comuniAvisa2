import NavBar from "../../components/NavBar";
import Button from "../../components/Button";
import Card from "../../components/Card"
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import alertIcon from "../../assets/alertIcon.svg";
import serviceIcon from "../../assets/serviceIcon.svg";
import communityIcon from "../../assets/communityIcon.svg";
import Footer from "../../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <>
    <div className={animate && "home"}>
      <NavBar>
        <div className="navbar-buttons">
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button onClick={() => navigate("/criarConta")}>Criar Conta</Button>
        </div>
      </NavBar>
      <div className="hero">
        <div className="hero-cta"><strong>ComuniAvisa</strong> aproxima vizinhos, fortalece comunidades e facilita a comunicação local.
          Crie alertas, compartilhe serviços, divulgue informações importantes e construa uma rede colaborativa onde você vive.</div>
      </div>
      <div className="about">
        <Button onClick={() => navigate("/criarConta")}>Começar Agora!</Button>
        <div className="about-title">Crie sua conta e faça parte da sua comunidade digital.</div>
        <div className="about-cards-container">
          <Card className="card card-home">
            <div className="card-title"><img src={alertIcon} alt="Alerta ícone"/> Alertas em Tempo Real</div>
            <div className="card-text">Receber e publicar avisos importantes para sua comunidade</div>
          </Card>
          <Card className="card card-home">
            <div className="card-title"><img src={serviceIcon} alt="Serviço ícone" /> Serviços e Oportunidades Locais</div>
            <div className="card-text">Valorizar o que é da sua comunidade</div>
          </Card>
          <Card className="card card-home">
            <div className="card-title"><img src={communityIcon} alt="Comunidade ícone"/> Comunidades Organizadas</div>
            <div className="card-text">Receber e publicar avisos importantes para sua comunidade</div>
          </Card>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}