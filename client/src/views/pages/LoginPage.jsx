import React, { useState } from "react";
import { useAuth } from "../../controllers/useAuthController";
import Input from "../components/Input";
import Button from "../components/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "E-mail obrigatório";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password.trim()) e.password = "Senha obrigatória";
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

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48 }}>🍻</div>
          <h1 className="login-title">Cervejaria Artesanal</h1>
          <p style={{ color: "#888", fontFamily: "monospace", fontSize: 13 }}>
            Sistema de Gestão
          </p>
        </div>

        {failed && (
          <div className="alert-danger">
            Credenciais incorretas. Tente:<br />
            admin@cervejaria.com (Mestre)<br />
            cliente@cervejaria.com (Cliente)<br />
            (Senha: 1234)
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          placeholder="admin@cervejaria.com"
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
        <Button style={{ width: "100%", marginTop: 8 }} onClick={handleSubmit}>
          Entrar no Sistema
        </Button>

        <p
          style={{
            textAlign: "center",
            color: "#555",
            fontSize: 11,
            marginTop: 16,
            fontFamily: "monospace",
            lineHeight: 1.4
          }}
        >
          admin@cervejaria.com (Gestor)<br />
          cliente@cervejaria.com (Consumidor)<br />
          Senha: 1234
        </p>
      </div>
    </div>
  );
}
