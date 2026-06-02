import { Link } from "react-router-dom";
import { ArrowRight, FileText, Mail, History } from "lucide-react";

const features = [
    {
        icon: <FileText size={16} strokeWidth={1.5} />,
        title: "Tailored cover letters",
        desc: "AI generates a 3-paragraph cover letter matched to the job description — no generic templates.",
    },
    {
        icon: <Mail size={16} strokeWidth={1.5} />,
        title: "Cold outreach emails",
        desc: "Get a ready-to-send email with subject line to reach the hiring manager directly.",
    },
    {
        icon: <History size={16} strokeWidth={1.5} />,
        title: "Full history",
        desc: "Every generation is saved. Come back, copy, and reuse anytime.",
    },
];

export default function Landing() {
    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

            {/* ── Navbar ── */}
            <nav style={{
                borderBottom: "0.5px solid var(--border)",
                height: "52px",
                display: "flex",
                alignItems: "center",
            }}>
                <div className="page-container" style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                }}>
                    <span style={{ fontSize: "15px", fontWeight: "500" }}>Coverly</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Link to="/login" className="btn-ghost">Log in</Link>
                        <Link to="/register" className="btn-primary">Get started</Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <div className="page-container" style={{
                paddingTop: "80px",
                paddingBottom: "80px",
                textAlign: "center",
                maxWidth: "640px",
            }}>
                <div style={{ marginBottom: "16px" }}>
                    <span className="badge badge-gray">Free to use</span>
                </div>

                <h1 style={{
                    fontSize: "36px",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    lineHeight: "1.25",
                    letterSpacing: "-0.02em",
                    marginBottom: "16px",
                }}>
                    Cover letters that get you interviews
                </h1>

                <p style={{
                    fontSize: "15px",
                    color: "var(--text-secondary)",
                    lineHeight: "1.7",
                    marginBottom: "32px",
                    maxWidth: "480px",
                    margin: "0 auto 32px",
                }}>
                    Paste a job description, describe your background, and get a
                    tailored cover letter and cold email in seconds.
                </p>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                    <Link to="/register" className="btn-primary">
                        Get started free
                        <ArrowRight size={14} strokeWidth={1.5} />
                    </Link>
                    <Link to="/login" className="btn-ghost">Log in</Link>
                </div>
            </div>

            {/* ── Divider ── */}
            <div className="page-container">
                <hr className="divider" />
            </div>

            {/* ── Features ── */}
            <div className="page-container" style={{
                paddingTop: "60px",
                paddingBottom: "80px",
            }}>
                <p style={{
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "32px",
                    textAlign: "center",
                }}>
                    What you get
                </p>

                <div className="features-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "1px",
                    background: "var(--border)",
                    border: "0.5px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    overflow: "hidden",
                }}>
                    {features.map((f) => (
                        <div key={f.title} style={{
                            background: "var(--bg)",
                            padding: "1.5rem",
                        }}>
                            <div style={{
                                color: "var(--text-secondary)",
                                marginBottom: "10px",
                            }}>
                                {f.icon}
                            </div>
                            <p style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                marginBottom: "6px",
                                color: "var(--text-primary)",
                            }}>
                                {f.title}
                            </p>
                            <p style={{
                                fontSize: "13px",
                                color: "var(--text-secondary)",
                                lineHeight: "1.6",
                            }}>
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Footer ── */}
            <div style={{
                borderTop: "0.5px solid var(--border)",
                padding: "20px 0",
                textAlign: "center",
            }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Coverly — Built with React + Node.js + Groq AI
                </p>
            </div>

        </div>
    );
}