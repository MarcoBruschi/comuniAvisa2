import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignPage from "./pages/SignPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import UserAccountPage from "./pages/UserAccountPage";
import UsersManagerPage from "./pages/UsersManagerPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostsPage from "./pages/PostsPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/criarConta" element={<SignPage />} />
          <Route path="/home" element={<MainPage />} />
          <Route path="/home/dados" element={<UserAccountPage />} />
          <Route path="/home/admin/usuarios" element={<UsersManagerPage />} />
          <Route path="/home/criarPost" element={<CreatePostPage />} />
          <Route path="/home/posts" element={<PostsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
