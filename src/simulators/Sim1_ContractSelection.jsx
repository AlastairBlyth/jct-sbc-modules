import { useState } from "react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════════
   Simulator 1: Contract Selection
   Extracted from Module 1 — standalone route
   ═══════════════════════════════════════════════════════════════════════ */

const S = { bg: "#0c1b2e", card: "#132840", accent: "#e8a838", accentDim: "#c48a24", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", ok: "#34d399", okBg: "rgba(52,211,153,0.12)", bad: "#f87171", badBg: "rgba(248,113,113,0.1)", bdr: "#1e3a5f" };

const SIM_BRIEFS = [
  { id: 1, icon: "🏫", title: "New Primary School", brief: "A local authority is building a new 2-form entry primary school. Budget: £9 million. The authority's architect has produced detailed RIBA Stage 4 drawings and a Quantity Surveyor has prepared full bills of quantities using NRM2. The authority wants its architect and Quantity Surveyor to administer the contract. The mechanical and electrical installation will be designed by the specialist sub-contractor.",
    question: "Which JCT contract is most appropriate?",
    options: [
      { label: "JCT Design and Build Contract (DB 2024)", feedback: "The Employer has already prepared a full design — there is no need to shift design responsibility to the Contractor. The DB 2024 is for projects where the Contractor takes overall design responsibility.", points: 2 },
      { label: "JCT Standard Building Contract With Quantities (SBC/Q 2024)", feedback: "Correct! This is a larger project with a full design prepared by the Employer, bills of quantities, and professional consultants appointed to administer the contract. The mechanical and electrical element can be accommodated through a Contractor's Designed Portion (CDP). All four primary criteria for the SBC/Q are met.", points: 10, correct: true },
      { label: "JCT Minor Works Building Contract (MW 2024)", feedback: "The Minor Works contract is designed for smaller, simpler projects. A £9 million school with full bills of quantities requires the comprehensive provisions of the SBC/Q.", points: 0 },
      { label: "JCT Intermediate Building Contract (IC 2024)", feedback: "The Intermediate contract is for projects of moderate complexity. A £9 million school with full bills of quantities and professional consultants is better served by the SBC/Q, which provides more detailed provisions.", points: 3 },
    ],
  },
  { id: 2, icon: "🏢", title: "Commercial Office Fit-Out", brief: "A technology company wants to fit out 3 floors of a newly leased office building. Budget: £1.2 million. The company has appointed an interior designer who has produced detailed drawings and a specification, but no bills of quantities have been prepared. The company does not want to appoint a Quantity Surveyor — the interior designer will administer the contract.",
    question: "Which JCT contract is most appropriate?",
    options: [
      { label: "JCT Standard Building Contract With Quantities (SBC/Q 2024)", feedback: "The SBC/Q requires bills of quantities and the appointment of both an Architect/Contract Administrator and a Quantity Surveyor. This project has neither bills of quantities nor a Quantity Surveyor. The SBC/Q would be inappropriate.", points: 1 },
      { label: "JCT Standard Building Contract Without Quantities (SBC/XQ 2024)", feedback: "This is a reasonable alternative since there are no bills of quantities, but the SBC/XQ still requires the appointment of both an Architect/Contract Administrator and Quantity Surveyor. The company does not want a Quantity Surveyor.", points: 4 },
      { label: "JCT Intermediate Building Contract (IC 2024)", feedback: "Correct! The IC 2024 is designed for projects of moderate complexity where detailed SBC provisions are not necessary. It can work with a specification rather than bills of quantities. However, note that the IC still requires an Architect/Contract Administrator — the interior designer would need appropriate professional qualifications.", points: 10, correct: true },
      { label: "JCT Design and Build Contract (DB 2024)", feedback: "The Employer has already produced a detailed design — there is no need for the Contractor to take design responsibility. The DB 2024 is for projects where the Contractor designs.", points: 2 },
    ],
  },
  { id: 3, icon: "🏗️", title: "Warehouse Development", brief: "A logistics company wants a new 10,000 sq m distribution warehouse. Budget: £15 million. The company has a clear performance specification (loading capacity, temperature control, number of loading bays) but does not want to commission a detailed design. It wants a single contractor to be responsible for both the design and construction, working to the company's requirements.",
    question: "Which JCT contract is most appropriate?",
    options: [
      { label: "JCT Standard Building Contract With Quantities (SBC/Q 2024)", feedback: "The SBC/Q requires the Employer to provide detailed drawings and bills of quantities. This company has only a performance specification and wants the Contractor to design. The SBC/Q is not appropriate.", points: 1 },
      { label: "JCT Design and Build Contract (DB 2024)", feedback: "Correct! The company has Employer's Requirements (the performance specification) and wants a single contractor to take responsibility for both design and construction. The DB 2024 is designed precisely for this procurement method. The Contractor will respond with Contractor's Proposals and a lump sum price.", points: 10, correct: true },
      { label: "JCT Minor Works Building Contract (MW 2024)", feedback: "A £15 million warehouse is far too large and complex for the Minor Works contract.", points: 0 },
      { label: "JCT Management Building Contract (MC 2024)", feedback: "Management contracting involves a management contractor overseeing trade packages. The company wants a single point of responsibility for design and construction, which is design and build.", points: 2 },
    ],
  },
  { id: 4, icon: "🏠", title: "Residential Extension", brief: "A homeowner wants a single-storey rear extension to their house. Budget: £85,000. A local architect has produced drawings. No bills of quantities. The architect will oversee the work.",
    question: "Which JCT contract is most appropriate?",
    options: [
      { label: "JCT Standard Building Contract With Quantities (SBC/Q 2024)", feedback: "The SBC/Q is designed for larger, more complex works. An £85,000 domestic extension does not require — and would be burdened by — its comprehensive provisions.", points: 0 },
      { label: "JCT Minor Works Building Contract (MW 2024)", feedback: "Correct! The MW 2024 is designed for smaller, straightforward projects where the Employer has appointed an Architect/Contract Administrator. It provides simple and concise conditions appropriate for domestic and small commercial works. No Quantity Surveyor is required, and it works with drawings and a specification rather than bills of quantities.", points: 10, correct: true },
      { label: "JCT Design and Build Contract (DB 2024)", feedback: "The architect has already designed the extension — there is no need for the Contractor to take design responsibility.", points: 1 },
      { label: "JCT Intermediate Building Contract (IC 2024)", feedback: "The IC is for projects of moderate complexity. An £85,000 domestic extension is simpler than the IC is designed for — the Minor Works contract is more appropriate.", points: 4 },
    ],
  },
  { id: 5, icon: "🏥", title: "Hospital Refurbishment in Phases", brief: "An NHS Trust is refurbishing three wards of an existing hospital. Budget: £4.5 million. The works must be completed in three phases (one ward at a time) so the hospital can remain operational. The Trust's architect has produced full drawings and a Quantity Surveyor has prepared bills of quantities. Two of the specialist systems (nurse call and medical gases) will be designed by the installing contractors.",
    question: "Which JCT contract is most appropriate?",
    options: [
      { label: "JCT Standard Building Contract With Quantities (SBC/Q 2024) with Sectional Completion and a Contractor's Designed Portion", feedback: "Correct! All four SBC/Q criteria are met: larger works, Employer's design, bills of quantities, and professional consultants. The three-phase requirement is accommodated by Sectional Completion (each ward is a Section with its own dates and liquidated damages). The specialist systems designed by the installing contractors are accommodated by a Contractor's Designed Portion (CDP). This is exactly the kind of project the SBC/Q's optional provisions are designed for.", points: 10, correct: true },
      { label: "JCT Design and Build Contract (DB 2024)", feedback: "The Trust has already commissioned a full design. While the DB could theoretically work with detailed Employer's Requirements, the Trust wants its own architect and Quantity Surveyor to administer the contract, which points to the SBC/Q.", points: 2 },
      { label: "Three separate JCT Minor Works contracts — one per ward", feedback: "While phasing could be achieved with separate contracts, this creates three separate contractual relationships, makes coordination difficult, and loses the protections of the SBC/Q's comprehensive provisions. Sectional Completion within a single SBC/Q is much more appropriate for a £4.5 million project.", points: 1 },
      { label: "JCT Standard Building Contract With Quantities (SBC/Q 2024) without Sectional Completion", feedback: "Close, but without Sectional Completion the contract has only one Completion Date. The phased ward-by-ward requirement needs separate dates, liquidated damages, and Rectification Periods for each phase — this requires Sectional Completion.", points: 5 },
    ],
  },
];

export default function Sim1ContractSelection() {
  const [states, setStates] = useState({});
  const totalPts = Object.values(states).reduce((a, s) => a + (s?.points || 0), 0);
  const answered = Object.values(states).filter(s => s?.answered).length;

  function handleChoice(briefId, optIdx) {
    const brief = SIM_BRIEFS.find(b => b.id === briefId);
    const opt = brief.options[optIdx];
    setStates(prev => ({ ...prev, [briefId]: { answered: true, selected: optIdx, correct: !!opt.correct, points: opt.points, message: opt.feedback } }));
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      <Link to="/" style={{ position: "fixed", top: 16, right: 20, zIndex: 999, padding: "7px 16px", borderRadius: 8, background: "rgba(15,42,68,0.85)", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5, backdropFilter: "blur(8px)" }}>← All Modules</Link>
      <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", padding: "32px 24px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: S.pri, fontFamily: "'Playfair Display', Georgia, serif" }}>📋 Contract Selection Simulator</div>
              <div style={{ fontSize: 13, color: S.sec, marginTop: 4 }}>You are the Employer's professional adviser. Choose the most appropriate JCT contract for each project.</div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: 1 }}>Projects</div><div style={{ fontSize: 15, fontWeight: 700, color: S.accent }}>{answered}/5</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: 1 }}>Score</div><div style={{ fontSize: 15, fontWeight: 700, color: S.teal }}>{totalPts}/50</div></div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {SIM_BRIEFS.map(b => {
              const st = states[b.id] || {};
              return (
                <div key={b.id} style={{ background: S.card, border: `1px solid ${st.answered ? (st.correct ? S.ok : S.bad) : S.bdr}`, borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.bdr}`, display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 28 }}>{b.icon}</span>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600, color: S.pri }}>{b.title}</div></div>
                    {st.answered && <div style={{ fontSize: 14, fontWeight: 700, color: st.correct ? S.ok : S.bad }}>{st.points}/10</div>}
                  </div>
                  <div style={{ padding: "18px 20px" }}><p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: S.pri }}>{b.brief}</p></div>
                  <div style={{ padding: "0 20px 20px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: S.teal, marginBottom: 10 }}>{b.question}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {b.options.map((o, i) => {
                        let bg = "rgba(0,0,0,0.15)", bd = S.bdr, tc = S.pri;
                        if (st.answered) { if (o.correct) { bg = S.okBg; bd = S.ok; tc = S.ok; } else if (i === st.selected) { bg = S.badBg; bd = S.bad; tc = S.bad; } else { tc = S.dim; } }
                        return <button key={i} onClick={() => !st.answered && handleChoice(b.id, i)} style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${bd}`, background: bg, textAlign: "left", cursor: st.answered ? "default" : "pointer", fontSize: 14, color: tc, fontWeight: st.answered && o.correct ? 700 : 400, lineHeight: 1.5 }}>{o.label}</button>;
                      })}
                    </div>
                    {st.answered && <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 8, background: st.correct ? S.okBg : S.badBg, borderLeft: `3px solid ${st.correct ? S.ok : S.bad}` }}><div style={{ fontSize: 13, fontWeight: 700, color: st.correct ? S.ok : S.bad, marginBottom: 4 }}>{st.correct ? "✓ Correct" : "✗ Review"} — {st.points} pts</div><div style={{ fontSize: 14, lineHeight: 1.7, color: S.pri }}>{st.message}</div></div>}
                  </div>
                </div>
              );
            })}
          </div>
          {answered === 5 && (
            <div style={{ background: S.card, border: `1px solid ${S.bdr}`, borderRadius: 14, padding: "36px 28px", textAlign: "center", marginTop: 24 }}>
              <div style={{ fontSize: 44, marginBottom: 8 }}>{totalPts >= 45 ? "🏆" : totalPts >= 35 ? "🎓" : "📚"}</div>
              <div style={{ fontSize: 38, fontWeight: 800, color: S.accent }}>{totalPts}/50</div>
              <div style={{ fontSize: 15, color: S.sec, marginTop: 10, lineHeight: 1.7 }}>
                {totalPts >= 45 ? "Outstanding — you selected the most appropriate contract for every project." : totalPts >= 35 ? "Strong understanding. Review the projects you got wrong." : "Revisit the learning sections and try the simulator again."}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
