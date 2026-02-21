import NavBar from "../../components/NavBar";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import axiosAuth from "../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";
import Footer from "../../components/Footer";
import "./style.css";

export default function PostsPage() {

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await axiosAuth.get("/api/usuario");
        if (response.data.sucesso) {
          setUsuario(response.data.sucesso);
          const alertasResponse = await axiosAuth.get("/api/alertas");
          if (alertasResponse.data.sucesso) setPosts(alertasResponse.data.sucesso);
        }
      } catch (error) {
        navigate("/login");
      }
    };

    verificarToken();
  }, [navigate]);

  function FormatarData(data) {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  return (
    <>
      <div className="main">
        <NavBar>
          <Button type="button" onClick={() => navigate("/home")}>Voltar</Button>
        </NavBar>
        <div className="main-form">
          <div className="main-posts">
            <div className="form-title">Posts</div>
            {message && <div className="message-field">{message}</div>}
            <hr className="form-line" />
            <div className="posts-cards">
              {posts && posts.map((post, index) =>
                <Card className="card" key={index}>
                  {post.imagem && <div className="post-image"><img src={post.imagem} alt={post.titulo} /></div>}
                  <div className="card-title">{post.tipo}: {post.titulo}</div>
                  {post.descricao && <div className="card-text">{post.descricao}</div>}
                  <div className="card-text">Postado por {post.user.userName}</div>
                  <div className="card-text">{FormatarData(post.data_postagem)}</div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}