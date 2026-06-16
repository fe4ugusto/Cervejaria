export function Badge({ children, color = "#c8860a" }) {
  return (
    <span style={{
      background: color + "22",
      color,
      border: `1px solid ${color}55`,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      fontFamily: "monospace",
      fontWeight: 700
    }}>
      {children}
    </span>
  );
}
