import "./style.css";

export default function Modal(props) {
  return (
    <div className="modal">
      <div className="modal-body">
        <div className="modal-title">
          {props.title}
          <hr className="modal-line" />
        </div>
        <div className="modal-text">{props.children}</div>
      </div>
    </div>
  );
}