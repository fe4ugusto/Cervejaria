import { styles } from "../styles";

export function Button({ children, variant = "primary", small, ...props }) {
  const base = styles.btn;
  const v = variant === "danger" ? styles.btnDanger : variant === "ghost" ? styles.btnGhost : styles.btnPrimary;
  const sz = small ? { padding: "5px 12px", fontSize: 12 } : {};
  return (
    <button style={{ ...base, ...v, ...sz }} {...props}>
      {children}
    </button>
  );
}
