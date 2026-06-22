import { styles } from "../styles";

export function Card({ children, style }) {
  return (
    <div style={{ ...styles.card, ...style }}>
      {children}
    </div>
  );
}
