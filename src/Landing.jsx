import { Link } from "react-router-dom";

const P = {
  navy: "#0f2a44", navyLight: "#1a3d5c", teal: "#1a8a7d", tealLight: "#2bb5a4",
  gold: "#d4a843", cream: "#faf8f5", white: "#ffffff", text: "#1e2a3a",
  textMid: "#4a5c6e", textLight: "#7a8c9e", border: "#dde3ea",
  shadow: "0 2px 16px rgba(15,42,68,0.07)",
};

const MODULES = [
  {
    num: 1,
    title: "Introduction & When to Use It",
    sub: "Purpose, scope, key roles, contract structure",
    path: "/module/1",
    status: "available",
    sections: ["What Is the SBC/Q?", "When to Use It", "Key Roles", "Contract Structure"],
  },
  {
    num: 2,
    title: "Contract Structure & Key Documents",
    sub: "Agreement, Conditions, and Schedules",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 3,
    title: "The Contract Administrator",
    sub: "Powers, duties, independence & case law",
    path: "/module/3",
    status: "available",
    sections: ["The Dual Role", "Instructions", "Certification", "EOT & Loss/Expense", "Key Case Law"],
  },
  {
    num: 4,
    title: "Contractor's Obligations",
    sub: "Section 2 — carrying out the Works",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 5,
    title: "Control of the Works",
    sub: "Section 3 — site management, sub-contracting",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 6,
    title: "Payment",
    sub: "Contract Sum, certificates, retention, final account",
    path: "/module/6",
    status: "available",
    sections: ["Contract Sum", "Payment Cycle", "Valuation & Retention", "Loss & Expense", "Final Account"],
  },
  {
    num: 7,
    title: "Extensions of Time",
    sub: "Clauses 2.26–2.29 — Relevant Events",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 8,
    title: "Variations",
    sub: "Section 5 — definition, valuation, quotation",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 9,
    title: "Practical Completion, Defects & Liquidated Damages",
    sub: "Clauses 2.30–2.39",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 10,
    title: "Insurance",
    sub: "Section 6 — Options A, B, C and PI cover",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 11,
    title: "Termination",
    sub: "Section 8 — grounds, procedure, consequences",
    path: null,
    status: "coming",
    sections: [],
  },
  {
    num: 12,
    title: "Dispute Resolution",
    sub: "Section 9 — mediation, adjudication, arbitration",
    path: null,
    status: "coming",
    sections: [],
  },
];

export default function Landing() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Sans+3:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{
        minHeight: "100vh",
        background: P.cream,
        fontFamily: "'Source Sans 3', 'Segoe UI', 'Helvetica Neue', sans-serif",
      }}>
        {/* ─── HEADER ─── */}
        <header style={{
          background: `linear-gradient(135deg, ${P.navy} 0%, ${P.navyLight} 100%)`,
          padding: "56px 40px 48px",
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            color: P.gold,
            textTransform: "uppercase",
            letterSpacing: 3,
            marginBottom: 12,
          }}>
            Learning Programme
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 40,
            fontWeight: 900,
            color: P.white,
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}>
            JCT Standard Building Contract<br />
            With Quantities 2024
          </h1>
          <p style={{
            fontSize: 17,
            color: "rgba(255,255,255,0.7)",
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Interactive modules covering the structure, administration, and key provisions
            of the SBC/Q 2024 — with case law, worked examples, and practice simulators.
          </p>
        </header>

        {/* ─── MODULE GRID ─── */}
        <div style={{
          maxWidth: 960,
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {MODULES.map((m) => {
              const available = m.status === "available";
              const inner = (
                <div style={{
                  background: P.white,
                  borderRadius: 14,
                  border: `1px solid ${available ? P.border : "#eaeaea"}`,
                  boxShadow: available ? P.shadow : "none",
                  padding: "28px 24px 24px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  opacity: available ? 1 : 0.55,
                  transition: "transform 0.15s, box-shadow 0.15s",
                  cursor: available ? "pointer" : "default",
                }}>
                  {/* Module number badge */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}>
                    <span style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: available
                        ? `linear-gradient(135deg, ${P.teal}, ${P.tealLight})`
                        : "#d0d5db",
                      color: P.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}>
                      {m.num}
                    </span>
                    {available ? (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: P.teal,
                      }}>Available</span>
                    ) : (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        color: P.textLight,
                      }}>Coming soon</span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: P.navy,
                    margin: "0 0 6px",
                    lineHeight: 1.3,
                  }}>
                    {m.title}
                  </h2>
                  <p style={{
                    fontSize: 14,
                    color: P.textMid,
                    margin: "0 0 16px",
                    lineHeight: 1.5,
                    flex: 1,
                  }}>
                    {m.sub}
                  </p>

                  {/* Section list for available modules */}
                  {available && m.sections.length > 0 && (
                    <div style={{
                      borderTop: `1px solid ${P.border}`,
                      paddingTop: 14,
                    }}>
                      {m.sections.map((s, i) => (
                        <div key={i} style={{
                          fontSize: 13,
                          color: s.includes("Simulator") ? P.gold : P.textMid,
                          fontWeight: s.includes("Simulator") ? 700 : 400,
                          padding: "3px 0",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}>
                          <span style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: s.includes("Simulator") ? P.gold : P.teal,
                            flexShrink: 0,
                          }} />
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );

              if (available) {
                return (
                  <Link
                    key={m.num}
                    to={m.path}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.firstChild.style.transform = "translateY(-3px)";
                      e.currentTarget.firstChild.style.boxShadow = "0 6px 24px rgba(15,42,68,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.firstChild.style.transform = "translateY(0)";
                      e.currentTarget.firstChild.style.boxShadow = P.shadow;
                    }}
                  >
                    {inner}
                  </Link>
                );
              }
              return <div key={m.num}>{inner}</div>;
            })}
          </div>

          {/* ─── SIMULATORS SECTION ─── */}
          <div style={{ marginTop: 48 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: P.teal,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 8,
            }}>Practice</div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 24,
              fontWeight: 700,
              color: P.navy,
              margin: "0 0 8px",
            }}>Simulators</h2>
            <p style={{
              fontSize: 15,
              color: P.textMid,
              marginBottom: 24,
              lineHeight: 1.6,
            }}>
              Email-inbox roleplay scenarios that put you in the professional's chair.
              Pre-written situations to test your knowledge before tackling real projects.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}>
              {[
                { num: 1, title: "Contract Selection", desc: "Choose the right JCT contract for 5 different project briefs", path: "/simulator/1", scenarios: 5, score: 50 },
                { num: 3, title: "Contract Administrator's Inbox", desc: "Handle 8 emails covering instructions, certificates, EOT, and site discoveries", path: "/simulator/3", scenarios: 8, score: 80 },
                { num: 6, title: "Payment Inbox", desc: "Calculate certificates, handle late payments, assess loss & expense claims, and manage the final account", path: "/simulator/6", scenarios: 8, score: 80 },
              ].map(s => (
                <Link key={s.num} to={s.path} style={{ textDecoration: "none", color: "inherit" }}
                  onMouseEnter={(e) => { e.currentTarget.firstChild.style.transform = "translateY(-3px)"; e.currentTarget.firstChild.style.boxShadow = "0 6px 24px rgba(12,27,46,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.firstChild.style.transform = "translateY(0)"; e.currentTarget.firstChild.style.boxShadow = "0 2px 12px rgba(12,27,46,0.2)"; }}
                >
                  <div style={{
                    background: "linear-gradient(135deg, #0c1b2e 0%, #132840 100%)",
                    borderRadius: 14,
                    padding: "24px 24px 20px",
                    boxShadow: "0 2px 12px rgba(12,27,46,0.2)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 22 }}>🎮</span>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#e8a838" }}>Module {s.num}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 700, color: "#e8ecf1", margin: "0 0 6px" }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 14px", lineHeight: 1.5 }}>
                      {s.desc}
                    </p>
                    <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
                      <div style={{ fontSize: 12, color: "#2ec4a8" }}>{s.scenarios} scenarios</div>
                      <div style={{ fontSize: 12, color: "#8fa3ba" }}>Score: /&thinsp;{s.score}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ─── ASSISTANTS SECTION ─── */}
          <div style={{ marginTop: 48 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: P.gold,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 8,
            }}>Practice Tools</div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 24,
              fontWeight: 700,
              color: P.navy,
              margin: "0 0 8px",
            }}>Assistants</h2>
            <p style={{
              fontSize: 15,
              color: P.textMid,
              marginBottom: 24,
              lineHeight: 1.6,
            }}>
              Real-world tools for administering the contract — calculators, notice drafters,
              and an AI advisor for when you need help with a specific situation.
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}>
              <Link to="/assistant/payment" style={{ textDecoration: "none", color: "inherit" }}
                onMouseEnter={(e) => { e.currentTarget.firstChild.style.transform = "translateY(-3px)"; e.currentTarget.firstChild.style.boxShadow = "0 6px 24px rgba(15,42,68,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.firstChild.style.transform = "translateY(0)"; e.currentTarget.firstChild.style.boxShadow = P.shadow; }}
              >
                <div style={{
                  background: P.navy,
                  borderRadius: 14,
                  padding: "28px 24px 24px",
                  boxShadow: P.shadow,
                  transition: "transform 0.15s, box-shadow 0.15s",
                  cursor: "pointer",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: 28 }}>🔧</span>
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: P.gold }}>Available</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: P.white, margin: "0 0 6px" }}>
                    Payment Assistant
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 16px", lineHeight: 1.5 }}>
                    Timeline calculator, certificate calculator, notice drafter, AI situation advisor, and final account tracker.
                  </p>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 14 }}>
                    {["Payment Timeline Calculator", "Certificate Calculator", "Notice Drafter", "AI Situation Advisor", "Final Account Tracker"].map((s, i) => (
                      <div key={i} style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", padding: "3px 0", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: i === 3 ? P.gold : P.tealLight, flexShrink: 0 }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
              {/* Placeholder for future assistants */}
              <div>
                <div style={{
                  background: P.white,
                  borderRadius: 14,
                  border: "1px solid #eaeaea",
                  padding: "28px 24px 24px",
                  opacity: 0.55,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: 28 }}>🔧</span>
                    <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: P.textLight }}>Coming soon</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: P.navy, margin: "0 0 6px" }}>
                    Contract Administrator Assistant
                  </h3>
                  <p style={{ fontSize: 14, color: P.textMid, margin: 0, lineHeight: 1.5 }}>
                    Instruction drafter, EOT decision helper, Practical Completion assessor, and certification tracker.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── FOOTER NOTE ─── */}
          <div style={{
            textAlign: "center",
            marginTop: 48,
            padding: "24px 20px",
            borderTop: `1px solid ${P.border}`,
          }}>
            <p style={{ fontSize: 14, color: P.textLight, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
              This programme covers the JCT Standard Building Contract With Quantities 2024 (SBC/Q).
              Each module includes interactive exercises and a practice simulator.
              Modules are being developed progressively — check back for new content.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
