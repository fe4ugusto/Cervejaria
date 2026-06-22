import { styles } from "../styles";

export function Modal({ title, onClose, children }) {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: "#f5c842", fontFamily: "'Playfair Display', serif", fontSize: 20 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#888", fontSize: 20, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
