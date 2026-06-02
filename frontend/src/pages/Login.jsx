import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../services/api";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/dashboard");
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // do NOT clear error here
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Client-side validation before API call
        if (!form.email || !form.password) {
            setError("Please enter your email and password");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError("Please enter a valid email address");
            return;
        }
        setError("");
        setLoading(true);

        login(form)
            .then((data) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            })
            .catch((err) => {

                // Never expose "Validation failed" — always show friendly message
                const serverError = err.response?.data?.error;
                                
                if (serverError === "Validation failed") {
                    setError("Please enter a valid email and password");
                } else {
                    setError(serverError || "Something went wrong. Please try again.");
                }
            })
            .finally(() => setLoading(false));
    };
    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
        }}>

            {/* ── Nav ── */}
            <nav style={{
                borderBottom: "0.5px solid var(--border)",
                height: "52px",
                display: "flex",
                alignItems: "center",
                padding: "0 1.5rem",
            }}>
                <Link to="/" style={{ fontSize: "15px", fontWeight: "500" }}>
                    Coverly
                </Link>
            </nav>

            {/* ── Form ── */}
            <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1.5rem",
            }}>
                <div style={{ width: "100%", maxWidth: "380px" }}>

                    {/* Header */}
                    <div style={{ marginBottom: "24px" }}>
                        <h1 style={{ fontSize: "20px", fontWeight: "500", marginBottom: "4px" }}>
                            Welcome back
                        </h1>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            Log in to your Coverly account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        {/* Error */}
                        {error && (
                            <div className="error-banner" style={{ marginBottom: "16px" }}>
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="field">
                            <label className="label" htmlFor="email">Email</label>
                            <input
                                id="email"
                                className="input"
                                type="text"
                                name="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div className="field">
                            <label className="label" htmlFor="password">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password"
                                    className="input"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    style={{ paddingRight: "38px" }}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                        color: "var(--text-muted)",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {showPassword
                                        ? <EyeOff size={15} strokeWidth={1.5} />
                                        : <Eye size={15} strokeWidth={1.5} />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: "100%", marginTop: "20px", justifyContent: "center" }}
                        >
                            {loading ? "Logging in..." : "Log in"}
                        </button>

                    </form>
                    {/* Register link */}
                    <p style={{
                        textAlign: "center",
                        marginTop: "16px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                    }}>
                        Don't have an account?{" "}
                        <Link to="/register" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                            Sign up
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}