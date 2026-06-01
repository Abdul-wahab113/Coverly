import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        register(form)
            .then((data) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/dashboard");
            })
            .catch((err) => {
                const details = err.response?.data?.details;
                if (details) {
                    setError(details.map((d) => d.message).join(", "));
                } else {
                    setError(err.response?.data?.error || "Something went wrong");
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
                            Create your account
                        </h1>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            Start generating cover letters for free
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="error-banner" style={{ marginBottom: "16px" }}>
                            {error}
                        </div>
                    )}

                    {/* Full Name */}
                    <div className="field">
                        <label className="label">Full name</label>
                        <input
                            className="input"
                            type="text"
                            name="fullName"
                            placeholder="Abdul Rehman"
                            value={form.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="field">
                        <label className="label">Email</label>
                        <input
                            className="input"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="field">
                        <label className="label">Password</label>
                        <div style={{ position: "relative" }}>
                            <input
                                className="input"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Min 8 chars, 1 uppercase, 1 number"
                                value={form.password}
                                onChange={handleChange}
                                style={{ paddingRight: "38px" }}
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
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ width: "100%", marginTop: "20px", justifyContent: "center" }}
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                    {/* Login link */}
                    <p style={{
                        textAlign: "center",
                        marginTop: "16px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                    }}>
                        Already have an account?{" "}
                        <Link to="/login" style={{ color: "var(--text-primary)", fontWeight: "500" }}>
                            Log in
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}