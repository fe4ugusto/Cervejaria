import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { styles } from "../styles";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [failed, setFailed] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "E-mail obrigatório";
    else if (email !== "cliente@cervejaria" && !/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!password.trim()) e.password = "Senha obrigatória";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const ok = await login(email, password);
    if (!ok) { setFailed(true); setErrors({}); }
  };

  return (
    <div style={styles.loginWrap}>
      <div style={styles.loginBox}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48 }}>🍻</div>
          <h1 style={styles.loginTitle}>Cervejaria Artesanal</h1>
          <p style={{ color: "#888", fontFamily: "monospace", fontSize: 13 }}>Sistema de Gestão</p>
        </div>

        {failed && (
          <div style={styles.alertDanger}>Credenciais incorretas. Verifique seu e-mail e senha.</div>
        )}

        <Input label="E-mail" type="email" placeholder="seu@email.com" value={email}
          onChange={e => { setEmail(e.target.value); setFailed(false); }} error={errors.email} />
        <Input label="Senha" type="password" placeholder="••••••" value={password}
          onChange={e => { setPassword(e.target.value); setFailed(false); }} error={errors.password} />
        <Button style={{ width: "100%", marginTop: 8 }} onClick={handleSubmit}>
          Entrar no Sistema
        </Button>
      </div>
    </div>
  );
}
