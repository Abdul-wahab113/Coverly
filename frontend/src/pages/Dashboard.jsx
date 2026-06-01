import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGenerations, deleteGeneration } from "../services/api";
import Navbar from "../components/Navbar";
import { FileText, Plus, Trash2, Mail, Calendar } from "lucide-react";

export default function Dashboard() {
    const [generations, setGenerations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        getGenerations()
            .then((data) => setGenerations(data.generations))
            .catch(() => setError("Failed to load generations"))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (id) => {
        setDeleting(id);
        deleteGeneration(id)
            .then(() => setGenerations((prev) => prev.filter((g) => g.id !== id)))
            .catch(() => setError("Failed to delete"))
            .finally(() => setDeleting(null));
    };

    const formatDate = (iso) => {
        return new Date(iso).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const toneBadge = (tone) => {
        const map = {
            confident: "badge-blue",
            professional: "badge-gray",
            friendly: "badge-green",
        };
        return map[tone] || "badge-gray";
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />

            <div className="page-container" style={{ paddingTop: "36px", paddingBottom: "60px" }}>

                {/* ── Header ── */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "28px",
                }}>
                    <div>
                        <h1 style={{ fontSize: "18px", fontWeight: "500" }}>
                            Good to see you, {user.fullName?.split(" ")[0]}
                        </h1>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "3px" }}>
                            {generations.length} generation{generations.length !== 1 ? "s" : ""} so far
                        </p>
                    </div>
                    <Link to="/generate" className="btn-primary">
                        <Plus size={14} strokeWidth={1.5} />
                        <span className="nav-link-text">New generation</span>
                    </Link>
                </div>

                {/* ── Error ── */}
                {error && (
                    <div className="error-banner" style={{ marginBottom: "20px" }}>
                        {error}
                    </div>
                )}

                {/* ── Loading ── */}
                {loading && (
                    <div style={{ padding: "40px 0", textAlign: "center" }}>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                            Loading...
                        </p>
                    </div>
                )}

                {/* ── Empty State ── */}
                {!loading && generations.length === 0 && (
                    <div style={{
                        border: "0.5px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        padding: "60px 20px",
                        textAlign: "center",
                    }}>
                        <div style={{
                            width: "40px",
                            height: "40px",
                            border: "0.5px solid var(--border)",
                            borderRadius: "var(--radius-md)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 14px",
                            color: "var(--text-muted)",
                        }}>
                            <FileText size={18} strokeWidth={1.5} />
                        </div>
                        <p style={{ fontSize: "14px", fontWeight: "500", marginBottom: "6px" }}>
                            No generations yet
                        </p>
                        <p style={{
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                            marginBottom: "20px",
                        }}>
                            Create your first cover letter and cold email
                        </p>
                        <Link to="/generate" className="btn-primary">
                            <Plus size={14} strokeWidth={1.5} />
                            New generation
                        </Link>
                    </div>
                )}

                {/* ── Generations List ── */}
                {!loading && generations.length > 0 && (
                    <div style={{
                        border: "0.5px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                    }}>

                        {/* Table Header — hidden on mobile */}
                        <div className="dashboard-table-header" style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr 1fr 140px",
                            gap: "12px",
                            padding: "10px 16px",
                            background: "var(--bg-secondary)",
                            borderBottom: "0.5px solid var(--border)",
                        }}>
                            {["Job", "Company", "Tone", "Date", "Actions"].map((h) => (
                                <span key={h} style={{
                                    fontSize: "11px",
                                    fontWeight: "500",
                                    color: "var(--text-muted)",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                }}>
                                    {h}
                                </span>
                            ))}
                        </div>

                        {/* Rows */}
                        {generations.map((g, i) => (
                            <div
                                key={g.id}
                                className="dashboard-row"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 1fr 1fr 140px",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    alignItems: "center",
                                    borderBottom: i < generations.length - 1
                                        ? "0.5px solid var(--border)"
                                        : "none",
                                    background: "var(--bg)",
                                }}
                            >
                                {/* Job Title */}
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "var(--radius-sm)",
                                        background: "var(--bg-secondary)",
                                        border: "0.5px solid var(--border)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        color: "var(--text-muted)",
                                    }}>
                                        <FileText size={13} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <p style={{
                                            fontSize: "13px",
                                            fontWeight: "500",
                                            color: "var(--text-primary)",
                                        }}>
                                            {g.jobTitle}
                                        </p>
                                        <p style={{
                                            fontSize: "11px",
                                            color: "var(--text-muted)",
                                            marginTop: "1px",
                                        }}>
                                            Cover letter + cold email
                                        </p>
                                    </div>
                                </div>

                                {/* Company */}
                                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                    {g.companyName}
                                </span>

                                {/* Tone */}
                                <div>
                                    <span className={`badge ${toneBadge(g.tone)}`}>
                                        {g.tone}
                                    </span>
                                </div>

                                {/* Date */}
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    color: "var(--text-muted)",
                                }}>
                                    <Calendar size={12} strokeWidth={1.5} />
                                    <span style={{ fontSize: "12px" }}>{formatDate(g.createdAt)}</span>
                                </div>

                                {/* Actions */}
                                <div className="dashboard-row-actions" style={{
                                    display: "flex",
                                    gap: "6px",
                                    alignItems: "center",
                                    width: "140px",
                                    justifyContent: "flex-end",
                                }}>
                                    <Link
                                        to={`/generate?view=${g.id}`}
                                        className="btn-ghost"
                                        style={{ padding: "5px 10px", fontSize: "12px" }}
                                    >
                                        <Mail size={12} strokeWidth={1.5} />
                                        View
                                    </Link>
                                    <button
                                        className="btn-danger"
                                        style={{ padding: "5px 10px", fontSize: "12px" }}
                                        onClick={() => handleDelete(g.id)}
                                        disabled={deleting === g.id}
                                    >
                                        <Trash2 size={12} strokeWidth={1.5} />
                                        {deleting === g.id ? "..." : "Delete"}
                                    </button>
                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}