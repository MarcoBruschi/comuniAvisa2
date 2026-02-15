import "./style.css";

export default function Form(props) {
  return (
    <form className="form" {...props}>
      {props.children}
    </form>
  );
}