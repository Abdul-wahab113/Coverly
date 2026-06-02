import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { generate, getGeneration, getSettings, updateSettings } from "../services/api";
import Navbar from "../components/Navbar";
import {
    FileText, Mail, Copy, Check,
    ArrowLeft, Loader, Save
} from "lucide-react";

const TONES = ["professional", "confident", "friendly"];

const DEFAULT_FORM = {
    jobTitle: "",
    companyName: "",
    jobDescription: "",
    userBackground: "",
    tone: "professional",
    hiringManagerName: "",
};

export default function Generate() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const viewId = searchParams.get("view");

    const [form, setForm] = useState(DEFAULT_FORM);
    const [result, setResult] = useState(null);
    const [activeTab, setActiveTab] = useState("coverLetter");
    const [loading, setLoading] = useState(false);
    const [loadingView, setLoadingView] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [savingDefaults, setSavingDefaults] = useState(false);
    const [defaultsSaved, setDefaultsSaved] = useState(false);

    useEffect(() => {
        if (!viewId) return;
        setLoadingView(true);
        getGeneration(viewId)
            .then((data) => {
                const g = data.generation;
                setForm({
                    jobTitle: g.jobTitle,
                    companyName: g.companyName,
                    jobDescription: g.jobDescription,
                    userBackground: g.userBackground,
                    tone: g.tone,
                    hiringManagerName: "",
                });
                setResult({
                    coverLetter: g.coverLetter,
                    coldEmail: {
                        subject: g.coldEmailSubject,
                        body: g.coldEmailBody,
                    },
                });
            })
            .catch(() => setError("Failed to load generation"))
            .finally(() => setLoadingView(false));
    }, [viewId]);

    // Prefill the form with the user's saved defaults (new generations only)
    useEffect(() => {
        if (viewId) return;
        getSettings()
            .then((data) => {
                const s = data.settings;
                setForm((prev) => ({
                    ...prev,
                    userBackground: s.defaultBackground || prev.userBackground,
                    tone: s.defaultTone || prev.tone,
                }));
            })
            .catch(() => {}); // best-effort — ignore prefill failures
    }, [viewId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = () => {
        if (!form.jobTitle || !form.companyName ||
            !form.jobDescription || !form.userBackground) {
            setError("Please fill in all required fields");
            return;
        }
        setLoading(true);
        setError("");
        setResult(null);

        generate(form)
            .then((data) => {
                const g = data.generation;
                setResult({
                    coverLetter: g.coverLetter,
                    coldEmail: {
                        subject: g.coldEmailSubject,
                        body: g.coldEmailBody,
                    },
                });
                setActiveTab("coverLetter");
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Generation failed. Try again.");
            })
            .finally(() => setLoading(false));
    };

    const handleSaveDefaults = () => {
        setSavingDefaults(true);
        setError("");
        updateSettings({
            defaultBackground: form.userBackground,
            defaultTone: form.tone,
        })
            .then(() => {
                setDefaultsSaved(true);
                setTimeout(() => setDefaultsSaved(false), 2000);
            })
            .catch((err) => {
                setError(err.response?.data?.error || "Failed to save defaults");
            })
            .finally(() => setSavingDefaults(false));
    };

    const handleCopy = () => {
        const text = activeTab === "coverLetter"
            ? result.coverLetter
            : `Subject: ${result.coldEmail.subject}\n\n${result.coldEmail.body}`;

        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    if (loadingView) {
        return (
            <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
                <Navbar />
                <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "center", height: "60vh",
                    color: "var(--text-muted)", fontSize: "13px",
                }}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
            <Navbar />

            <div className="page-container" style={{
                paddingTop: "32px",
                paddingBottom: "60px",
            }}>

                {/* ── Page Header ── */}
                <div style={{ marginBottom: "28px" }}>
                    <button
                        onClick={() => navigate("/dashboard")}
                        style={{
                            display: "flex", alignItems: "center", gap: "5px",
                            background: "none", border: "none", padding: 0,
                            fontSize: "13px", color: "var(--text-secondary)",
                            cursor: "pointer", marginBottom: "12px",
                        }}
                    >
                        <ArrowLeft size={14} strokeWidth={1.5} />
                        Back to dashboard
                    </button>
                    <h1 style={{ fontSize: "18px", fontWeight: "500" }}>
                        {viewId ? "View generation" : "New generation"}
                    </h1>
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "3px" }}>
                        {viewId
                            ? "Viewing a saved generation"
                            : "Fill in the details and generate your cover letter"}
                    </p>
                </div>

                {/* ── Two Column Layout ── */}
                <div
                    className="two-col-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "20px",
                        alignItems: "start",
                    }}
                >

                    {/* ── LEFT — Input Form ── */}
                    <div style={{
                        border: "0.5px solid var(--border)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                    }}>

                        {/* Form Header */}
                        <div style={{
                            padding: "14px 16px",
                            borderBottom: "0.5px solid var(--border)",
                            background: "var(--bg-secondary)",
                        }}>
                            <p style={{ fontSize: "13px", fontWeight: "500" }}>Job details</p>
                            {!viewId && (
                                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                                    Fields marked * are required
                                </p>
                            )}
                        </div>

                        <div style={{ padding: "16px" }}>

                            {/* ── Row 1: Job Title + Company ── */}
                            <div
                                className="two-col-grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "12px",
                                }}
                            >
                                <div>
                                    <label className="label">Job title {!viewId && "*"}</label>
                                    <input
                                        className="input"
                                        name="jobTitle"
                                        placeholder="Full Stack Developer"
                                        value={form.jobTitle}
                                        onChange={handleChange}
                                        disabled={!!viewId}
                                    />
                                </div>
                                <div>
                                    <label className="label">Company {!viewId && "*"}</label>
                                    <input
                                        className="input"
                                        name="companyName"
                                        placeholder="Stripe"
                                        value={form.companyName}
                                        onChange={handleChange}
                                        disabled={!!viewId}
                                    />
                                </div>
                            </div>

                            {/* ── Row 2: Tone + Hiring Manager ── */}
                            <div
                                className="two-col-grid"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "12px",
                                    marginTop: "12px",
                                }}
                            >
                                <div>
                                    <label className="label">Tone</label>
                                    <select
                                        className="input"
                                        name="tone"
                                        value={form.tone}
                                        onChange={handleChange}
                                        disabled={!!viewId}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {TONES.map((t) => (
                                            <option key={t} value={t}>
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Hiring manager name</label>
                                    <input
                                        className="input"
                                        name="hiringManagerName"
                                        placeholder="Sarah (optional)"
                                        value={form.hiringManagerName}
                                        onChange={handleChange}
                                        disabled={!!viewId}
                                    />
                                </div>
                            </div>

                            {/* ── Job Description ── */}
                            <div style={{ marginTop: "12px" }}>
                                <label className="label">Job description {!viewId && "*"}</label>
                                <textarea
                                    className="input"
                                    name="jobDescription"
                                    placeholder="Paste the full job description here..."
                                    value={form.jobDescription}
                                    onChange={handleChange}
                                    disabled={!!viewId}
                                    style={{ minHeight: "130px" }}
                                />
                            </div>

                            {/* ── User Background ── */}
                            <div style={{ marginTop: "12px" }}>
                                <label className="label">Your background {!viewId && "*"}</label>
                                <textarea
                                    className="input"
                                    name="userBackground"
                                    placeholder="Describe your skills, experience, and relevant projects..."
                                    value={form.userBackground}
                                    onChange={handleChange}
                                    disabled={!!viewId}
                                    style={{ minHeight: "130px" }}
                                />
                            </div>

                            {/* ── Error ── */}
                            {error && (
                                <div className="error-banner" style={{ marginTop: "12px" }}>
                                    {error}
                                </div>
                            )}

                            {/* ── Generate Button ── */}
                            {!viewId && (
                                <button
                                    className="btn-primary"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    style={{
                                        width: "100%",
                                        marginTop: "16px",
                                        justifyContent: "center",
                                        padding: "12px",
                                        fontSize: "14px",
                                    }}
                                >
                                    {loading
                                        ? <><Loader size={14} strokeWidth={1.5} /> Generating...</>
                                        : <><FileText size={14} strokeWidth={1.5} /> Generate cover letter</>
                                    }
                                </button>
                            )}

                            {/* ── Save as Defaults ── */}
                            {!viewId && (
                                <button
                                    className="btn-ghost"
                                    onClick={handleSaveDefaults}
                                    disabled={savingDefaults || !form.userBackground}
                                    style={{
                                        width: "100%",
                                        marginTop: "8px",
                                        justifyContent: "center",
                                        padding: "10px",
                                        fontSize: "13px",
                                    }}
                                >
                                    {defaultsSaved
                                        ? <><Check size={13} strokeWidth={1.5} /> Saved as defaults</>
                                        : <><Save size={13} strokeWidth={1.5} /> Save as my defaults</>
                                    }
                                </button>
                            )}

                        </div>
                    </div>

                    {/* ── RIGHT — Output ── */}
                    <div
                        className={!result && !loading ? "output-panel-empty" : ""}
                        style={{
                            border: "0.5px solid var(--border)",
                            borderRadius: "var(--radius-lg)",
                            overflow: "hidden",
                            position: "sticky",
                            top: "68px",
                        }}
                    >
                        {/* Output Header */}
                        <div style={{
                            padding: "14px 16px",
                            borderBottom: "0.5px solid var(--border)",
                            background: "var(--bg-secondary)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <p style={{ fontSize: "13px", fontWeight: "500" }}>Output</p>
                            {result && (
                                <button
                                    className="btn-ghost"
                                    onClick={handleCopy}
                                    style={{ padding: "5px 10px", fontSize: "12px" }}
                                >
                                    {copied
                                        ? <><Check size={12} strokeWidth={1.5} /> Copied</>
                                        : <><Copy size={12} strokeWidth={1.5} /> Copy</>
                                    }
                                </button>
                            )}
                        </div>

                        {/* ── Tabs ── */}
                        {result && (
                            <div style={{
                                display: "flex",
                                borderBottom: "0.5px solid var(--border)",
                                background: "var(--bg)",
                            }}>
                                {[
                                    { key: "coverLetter", label: "Cover letter", icon: <FileText size={13} strokeWidth={1.5} /> },
                                    { key: "coldEmail", label: "Cold email", icon: <Mail size={13} strokeWidth={1.5} /> },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "10px 16px",
                                            fontSize: "13px",
                                            background: "none",
                                            border: "none",
                                            borderBottom: activeTab === tab.key
                                                ? "1.5px solid var(--text-primary)"
                                                : "1.5px solid transparent",
                                            color: activeTab === tab.key
                                                ? "var(--text-primary)"
                                                : "var(--text-secondary)",
                                            fontWeight: activeTab === tab.key ? "500" : "400",
                                            cursor: "pointer",
                                            marginBottom: "-0.5px",
                                        }}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ── Output Content ── */}
                        <div style={{ padding: "16px", minHeight: "400px" }}>

                            {/* Empty state */}
                            {!result && !loading && (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "360px",
                                    color: "var(--text-muted)",
                                    textAlign: "center",
                                    gap: "8px",
                                }}>
                                    <FileText size={28} strokeWidth={1} />
                                    <p style={{ fontSize: "13px" }}>
                                        Your generated content will appear here
                                    </p>
                                </div>
                            )}

                            {/* Generating */}
                            {loading && (
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "360px",
                                    color: "var(--text-muted)",
                                    gap: "10px",
                                }}>
                                    <Loader size={22} strokeWidth={1.5} />
                                    <p style={{ fontSize: "13px" }}>Generating your content...</p>
                                </div>
                            )}

                            {/* Cover Letter */}
                            {result && activeTab === "coverLetter" && (
                                <p style={{
                                    fontSize: "13px",
                                    color: "var(--text-primary)",
                                    lineHeight: "1.8",
                                    whiteSpace: "pre-wrap",
                                }}>
                                    {result.coverLetter}
                                </p>
                            )}

                            {/* Cold Email */}
                            {result && activeTab === "coldEmail" && (
                                <div>
                                    <div style={{
                                        padding: "10px 12px",
                                        background: "var(--bg-secondary)",
                                        border: "0.5px solid var(--border)",
                                        borderRadius: "var(--radius-sm)",
                                        marginBottom: "14px",
                                    }}>
                                        <span style={{
                                            fontSize: "11px",
                                            fontWeight: "500",
                                            color: "var(--text-muted)",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.06em",
                                        }}>
                                            Subject
                                        </span>
                                        <p style={{
                                            fontSize: "13px",
                                            color: "var(--text-primary)",
                                            marginTop: "3px",
                                            fontWeight: "500",
                                        }}>
                                            {result.coldEmail.subject}
                                        </p>
                                    </div>
                                    <p style={{
                                        fontSize: "13px",
                                        color: "var(--text-primary)",
                                        lineHeight: "1.8",
                                        whiteSpace: "pre-wrap",
                                    }}>
                                        {result.coldEmail.body}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}