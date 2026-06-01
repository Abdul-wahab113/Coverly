import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
        }}>
            <p style={{
                fontSize: "11px",
                fontWeight: "500",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "12px",
            }}>
                404
            </p>
            <h1 style={{
                fontSize: "20px",
                fontWeight: "500",
                marginBottom: "8px",
            }}>
                Page not found
            </h1>
            <p style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "24px",
            }}>
                The page you're looking for doesn't exist.
            </p>
            <Link to="/" className="btn-ghost">
                <ArrowLeft size={14} strokeWidth={1.5} />
                Back to home
            </Link>
        </div>
    );
}