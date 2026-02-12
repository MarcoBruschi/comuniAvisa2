import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignPage from "./pages/SignPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import MainPage from "./pages/MainPage";
import UserAccountPage from "./pages/UserAccountPage";
import UsersManagerPage from "./pages/UsersManagerPage";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/criarConta" element={<SignPage/>}/>
        <Route path="/home" element={<MainPage/>}/>
        <Route path="/home/dados" element={<UserAccountPage/>}/>
        <Route path="/home/admin/usuarios" element={<UsersManagerPage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App
