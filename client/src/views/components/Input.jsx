import React from "react";

export default function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? "input-error" : ""}`} {...props} />
      {error && <p className="err-msg">{error}</p>}
    </div>
  );
}
