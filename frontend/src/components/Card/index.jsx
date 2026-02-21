import "./style.css";


export default function Card({ children, className }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}