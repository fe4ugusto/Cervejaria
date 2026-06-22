import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { styles } from "../styles";

export function LoginPage({ onBack }) {
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState(false);

  const validate = () => {
    const e = {};

    if (!email.trim()) {
      e.email = "E-mail obrigatório";
    } else if (
      email !== "cliente@cervejaria" &&
      !/\S+@\S+\.\S+/.test(email)
    ) {
      e.email = "E-mail inválido";
    }

    if (!password.trim()) {
      e.password = "Senha obrigatória";
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const ok = await login(email, password);

    if (!ok) {
      setFailed(true);
      setErrors({});
    }
  };

  const handleGoogle = async () => {
    const ok = await loginWithGoogle();

    if (!ok) {
      setFailed(true);
    }
  };

  return (
    <div style={styles.loginWrap}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 20,
            left: 24,
            background: "transparent",
            border: "none",
            color: "#f5c842",
            fontSize: "0.95rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "monospace",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.7")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          ← Voltar à página inicial
        </button>
      )}

      <div style={styles.loginBox}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48 }}>🍻</div>
          <h1 style={styles.loginTitle}>Cervejaria Artesanal</h1>
          <p
            style={{
              color: "#888",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            Sistema de Gestão
          </p>
        </div>

        {failed && (
          <div style={styles.alertDanger}>
            Credenciais incorretas. Verifique seu e-mail e senha.
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setFailed(false);
          }}
          error={errors.email}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFailed(false);
          }}
          error={errors.password}
        />

        <Button
          style={{ width: "100%", marginTop: 8 }}
          onClick={handleSubmit}
        >
          Entrar no Sistema
        </Button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "16px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#2a2510" }} />
          <span
            style={{
              color: "#666",
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            ou
          </span>
          <div style={{ flex: 1, height: 1, background: "#2a2510" }} />
        </div>

        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            background: "#fff",
            color: "#333",
            border: "none",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            width={20}
            alt="Google"
          />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}