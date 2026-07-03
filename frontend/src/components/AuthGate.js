import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthGate() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", name: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Smart Finance Assistant</p>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                value={form.name}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
              type="email"
              value={form.email}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              minLength="6"
              name="password"
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
              type="password"
              value={form.password}
            />
          </div>
          {error && <p className="form-error auth-error">{error}</p>}
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Sign up"}
          </button>
        </form>
        <button
          className="link-button"
          onClick={() => {
            setError("");
            setMode((currentMode) => (currentMode === "login" ? "signup" : "login"));
          }}
          type="button"
        >
          {mode === "login" ? "Create account" : "Use existing account"}
        </button>
      </section>
    </main>
  );
}
