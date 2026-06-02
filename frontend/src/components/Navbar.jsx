import { Link, useNavigate, useLocation } from "react-router-dom";
import { FileText, LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            borderBottom: "0.5px solid var(--border)",
            background: "var(--bg)",
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            <div className="page-container" style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "52px",
                width: "100%",
            }}>

                {/* ── Logo ── */}
                <Link to="/dashboard" style={{
                    fontSize: "15px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    flexShrink: 0,
                }}>
                    Coverly
                </Link>

                {/* ── Nav Links ── */}
                <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Link to="/dashboard" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 10px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        color: isActive("/dashboard")
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        background: isActive("/dashboard")
                            ? "var(--bg-secondary)"
                            : "transparent",
                        fontWeight: isActive("/dashboard") ? "500" : "400",
                    }}>
                        <LayoutDashboard size={15} strokeWidth={1.5} />
                        Dashboard
                    </Link>

                    <Link to="/generate" style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 10px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "13px",
                        color: isActive("/generate")
                            ? "var(--text-primary)"
                            : "var(--text-secondary)",
                        background: isActive("/generate")
                            ? "var(--bg-secondary)"
                            : "transparent",
                        fontWeight: isActive("/generate") ? "500" : "400",
                    }}>
                        <FileText size={15} strokeWidth={1.5} />
                        Generate
                    </Link>
                </div>

                {/* ── User + Logout ── */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <div style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: "var(--bg-secondary)",
                        border: "0.5px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: "500",
                        color: "var(--text-secondary)",
                        flexShrink: 0,
                    }}>
                        {user.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                    </div>

                    <span className="nav-user-name" style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                    }}>
                        {user.fullName}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="btn-ghost"
                        style={{ padding: "6px 10px", fontSize: "13px" }}
                    >
                        <LogOut size={14} strokeWidth={1.5} />
                        <span className="nav-link-text">Logout</span>
                    </button>
                </div>

            </div>
        </nav>
    );
}












