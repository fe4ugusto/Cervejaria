import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { styles } from "../styles";

export function LoginPage({ onBack }) {
  const { login, signup, loginWithGoogle } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState(false);

  const validate = () => {
    const e = {};

    if (!isLogin && !nome.trim()) {
      e.nome = "Nome é obrigatório";
    }

    if (!email.trim()) {
      e.email = "E-mail obrigatório";
    } else if (
      email !== "cliente@cervejaria.com" &&
      email !== "admin@cervejaria.com" &&
      !/\S+@\S+\.\S+/.test(email)
    ) {
      e.email = "E-mail inválido";
    }

    if (!password.trim()) {
      e.password = "Senha obrigatória";
    } else if (!isLogin && password.length < 6) {
      e.password = "A senha deve ter pelo menos 6 caracteres";
    }

    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    let ok = false;
    if (isLogin) {
      ok = await login(email, password);
    } else {
      ok = await signup(email, password, nome);
    }

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
            {isLogin ? "Acesse sua conta" : "Crie uma nova conta"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <button
            onClick={() => { setIsLogin(true); setErrors({}); setFailed(false); }}
            style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none",
              background: isLogin ? "#c8860a" : "#1a1c14",
              color: isLogin ? "#0c0d0f" : "#888",
              fontWeight: isLogin ? 700 : 400,
              cursor: "pointer", fontFamily: "'Syne', sans-serif"
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrors({}); setFailed(false); }}
            style={{
              flex: 1, padding: "10px", borderRadius: 8, border: "none",
              background: !isLogin ? "#c8860a" : "#1a1c14",
              color: !isLogin ? "#0c0d0f" : "#888",
              fontWeight: !isLogin ? 700 : 400,
              cursor: "pointer", fontFamily: "'Syne', sans-serif"
            }}
          >
            Cadastrar
          </button>
        </div>

        {failed && (
          <div style={styles.alertDanger}>
            {isLogin
              ? "Credenciais incorretas. Verifique seu e-mail e senha."
              : "Erro ao criar conta. E-mail pode já estar em uso."}
          </div>
        )}

        {!isLogin && (
          <Input
            label="Nome Completo"
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setFailed(false);
            }}
            error={errors.nome}
          />
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
          {isLogin ? "Entrar no Sistema" : "Criar Minha Conta"}
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