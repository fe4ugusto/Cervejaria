export function EmptyState({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 0", color: "#666" }}>
      <div style={{ fontSize: 36, marginBottom: 8 }}>🍺</div>
      <p style={{ fontFamily: "monospace" }}>{msg}</p>
    </div>
  );
}
