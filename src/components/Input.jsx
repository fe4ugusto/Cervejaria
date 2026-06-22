import { styles } from "../styles";

export function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={styles.label}>{label}</label>}
      <input
        style={{ ...styles.input, ...(error ? { borderColor: "#e05c2a" } : {}) }}
        {...props}
      />
      {error && <p style={styles.errMsg}>{error}</p>}
    </div>
  );
}
