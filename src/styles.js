export const styles = {
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 30%, #1a1200 0%, #0c0d0f 70%)" },
  loginBox: { background: "#13150f", border: "1px solid #2a2510", borderRadius: 16, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 0 60px #c8860a18" },
  loginTitle: { fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f5c842", marginTop: 10, marginBottom: 4 },
  alertDanger: { background: "#e05c2a18", border: "1px solid #e05c2a44", borderRadius: 8, padding: "10px 14px", color: "#e05c2a", fontSize: 13, fontFamily: "monospace", marginBottom: 16 },

  appWrap: { display: "flex", minHeight: "100vh" },
  sidebar: { width: 220, background: "#0f1109", borderRight: "1px solid #1e2010", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh" },
  sidebarLogo: { padding: "24px 20px", display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #1e2010" },
  sidebarFooter: { padding: "16px 20px", borderTop: "1px solid #1e2010" },
  navBtn: { width: "100%", display: "flex", gap: 10, alignItems: "center", padding: "12px 20px", background: "none", border: "none", color: "#666", fontSize: 14, cursor: "pointer", fontFamily: "'Syne', sans-serif", transition: "all .15s", textAlign: "left" },
  navBtnActive: { background: "#c8860a18", color: "#f5c842", borderRight: "3px solid #c8860a" },
  main: { flex: 1, padding: 32, overflowY: "auto", background: "#0c0d0f" },

  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  pageTitle: { fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#f5c842" },

  card: { background: "#13150f", border: "1px solid #1e2010", borderRadius: 12, padding: 18 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
  cardActions: { display: "flex", gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px solid #1e2010" },

  tableWrap: { overflowX: "auto", borderRadius: 12, border: "1px solid #1e2010" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#0f1109", padding: "12px 14px", textAlign: "left", fontSize: 11, color: "#666", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #1e2010" },
  tr: { borderBottom: "1px solid #141408" },
  td: { padding: "12px 14px", fontSize: 13, color: "#ccc" },

  label: { display: "block", marginBottom: 6, fontSize: 12, color: "#888", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 0.5 },
  input: { width: "100%", background: "#0f1109", border: "1px solid #2a2510", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 14, fontFamily: "'Syne', sans-serif", outline: "none" },
  errMsg: { color: "#e05c2a", fontSize: 11, marginTop: 4, fontFamily: "monospace" },

  btn: { border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, cursor: "pointer", fontFamily: "'Syne', sans-serif", fontWeight: 700, transition: "all .18s ease", letterSpacing: 0.3 },
  btnPrimary: { background: "#c8860a", color: "#0c0d0f", boxShadow: "0 10px 20px rgba(200, 134, 10, 0.18)" },
  btnDanger: { background: "#3b1111", color: "#f87171", border: "1px solid #5a1a1a", boxShadow: "inset 0 0 0 1px rgba(248, 113, 113, 0.12)" },
  btnGhost: { background: "rgba(248, 250, 252, 0.08)", color: "#f8fafc", border: "1px solid rgba(248, 250, 252, 0.18)", boxShadow: "0 0 0 1px rgba(248, 250, 252, 0.04)" },

  overlay: { position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#13150f", border: "1px solid #2a2510", borderRadius: 14, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 0 60px #c8860a22" },
};
