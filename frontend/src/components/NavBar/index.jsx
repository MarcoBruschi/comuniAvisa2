import { useNavigate } from "react-router-dom";
import "./style.css";

export default function NavBar({ children }) {
  const navigate = useNavigate();
  return (
    <>
      <div className="navbar">
        <div className="navbar-title" onClick={() => navigate("/")}>ComuniAvisa</div>
        {children}
      </div>
    </>
  );
}