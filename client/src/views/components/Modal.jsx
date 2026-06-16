import React from "react";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20
          }}
        >
          <h3
            style={{
              color: "var(--accent-gold)",
              fontFamily: "'Playfair Display', serif",
              fontSize: 20
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              fontSize: 20,
              cursor: "pointer"
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
