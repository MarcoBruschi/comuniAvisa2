import "./style.css";

export default function FormField(props) {
  return (
    <div className="formfield" {...props}>
      {props.children}
    </div>
  );
}