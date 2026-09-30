import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await api(isRegister ? "/auth/register" : "/auth/login", {
        method: "POST",
        body: form,
      });
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h2>{isRegister ? "Create account" : "Login"}</h2>
      {isRegister && <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
      <input name="password" type="password" placeholder="Password (min 6)" value={form.password} onChange={onChange} required minLength={6} />
      {error && <p className="error">{error}</p>}
      <button className="btn" type="submit">{isRegister ? "Register" : "Login"}</button>
      <p className="muted link" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "New here? Create an account"}
      </p>
    </form>
  );
}
