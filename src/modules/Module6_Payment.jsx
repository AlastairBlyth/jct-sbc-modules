import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   JCT SBC/Q 2024 — Payment Module + Simulator (Combined, v2)
   
   LEARNING MODULE: Exploratory interactions — sorting, calculating,
   predicting, matching. Short 1-question checks per section.
   
   SIMULATOR: Email-inbox roleplay. You receive messages, fill in
   certificates, calculate numbers, drag notices onto timelines,
   and deal with consequences of your decisions.
   ═══════════════════════════════════════════════════════════════════════ */

// ─── PALETTE ────────────────────────────────────────────────────────
function BackLink() { return <Link to="/" style={{ position: "fixed", top: 16, right: 20, zIndex: 999, padding: "7px 16px", borderRadius: 8, background: "rgba(15,42,68,0.85)", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5, backdropFilter: "blur(8px)" }}>← All Modules</Link>; }
const P = { navy: "#0f2a44", navyLight: "#1a3d5c", teal: "#1a8a7d", tealLight: "#2bb5a4", tealPale: "#e8f6f4", gold: "#d4a843", goldPale: "#fdf6e3", cream: "#faf8f5", white: "#ffffff", text: "#1e2a3a", textMid: "#4a5c6e", textLight: "#7a8c9e", border: "#dde3ea", correct: "#22855b", correctBg: "#e8f5ef", wrong: "#c0392b", wrongBg: "#fdeaea", shadow: "0 2px 16px rgba(15,42,68,0.07)" };
const S = { bg: "#0c1b2e", card: "#132840", accent: "#e8a838", accentDim: "#c48a24", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", ok: "#34d399", okBg: "rgba(52,211,153,0.12)", bad: "#f87171", badBg: "rgba(248,113,113,0.1)", bdr: "#1e3a5f" };

// ─── SECTIONS ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: "overview", title: "Overview", sub: "Section 4 at a Glance" },
  { id: "contract-sum", title: "Contract Sum", sub: "Clauses 4.1–4.4" },
  { id: "payment-cycle", title: "Payment Cycle", sub: "Clauses 4.7–4.13" },
  { id: "valuation", title: "Valuation & Retention", sub: "Clauses 4.14–4.19" },
  { id: "loss-expense", title: "Loss & Expense", sub: "Clauses 4.20–4.24" },
  { id: "final-account", title: "Final Account", sub: "Clauses 4.25–4.26" },
];

// ─── SHARED UI ──────────────────────────────────────────────────────
function Bar({ v, max, color = P.teal }) { return <div style={{ width: "100%", height: 4, background: P.border, borderRadius: 2 }}><div style={{ width: `${(v / max) * 100}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.4s" }} /></div>; }
function Card({ children, style }) { return <div style={{ background: P.white, borderRadius: 12, padding: "24px 28px", boxShadow: P.shadow, border: `1px solid ${P.border}`, ...style }}>{children}</div>; }
function Tip({ icon = "💡", title, children, accent = P.teal, bg = P.tealPale }) { return <div style={{ background: bg, borderLeft: `4px solid ${accent}`, borderRadius: "0 10px 10px 0", padding: "16px 20px", margin: "18px 0" }}><div style={{ fontSize: 14, fontWeight: 700, color: accent, marginBottom: 4 }}>{icon} {title}</div><div style={{ fontSize: 14, lineHeight: 1.7, color: P.text }}>{children}</div></div>; }
function Title({ children }) { return <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: P.navy, margin: "0 0 4px", lineHeight: 1.3 }}>{children}</h2>; }
function Sub({ children }) { return <div style={{ fontSize: 12, color: P.textLight, marginBottom: 22, textTransform: "uppercase", letterSpacing: 1.2 }}>{children}</div>; }
function Pg({ children }) { return <p style={{ fontSize: 15, lineHeight: 1.8, color: P.text, margin: "0 0 14px" }}>{children}</p>; }
function H3({ children }) { return <h3 style={{ fontSize: 16, fontWeight: 700, color: P.navy, margin: "22px 0 8px" }}>{children}</h3>; }

function NavBtn({ current, set, total }) {
  const lastLearn = total - 2;
  return <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 18, borderTop: `1px solid ${P.border}` }}>
    <button onClick={() => set(Math.max(0, current - 1))} disabled={current === 0} style={{ padding: "9px 20px", fontSize: 14, fontWeight: 600, borderRadius: 8, border: `1px solid ${P.border}`, background: P.white, color: current === 0 ? P.textLight : P.navy, cursor: current === 0 ? "default" : "pointer", opacity: current === 0 ? 0.4 : 1 }}>← Previous</button>
    <button onClick={() => set(Math.min(total - 1, current + 1))} disabled={current === total - 1} style={{ padding: "9px 20px", fontSize: 14, fontWeight: 600, borderRadius: 8, border: "none", background: current === total - 1 ? P.textLight : `linear-gradient(135deg, ${P.teal}, ${P.tealLight})`, color: P.white, cursor: current === total - 1 ? "default" : "pointer", opacity: current === total - 1 ? 0.4 : 1 }}>{"Next →"}</button>
  </div>;
}

// ─── INTERACTIVE: SORT EXERCISE ─────────────────────────────────────
function SortExercise({ title, instruction, items, correctOrder, onComplete }) {
  const [order, setOrder] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  function handleDragStart(i) { setDragIdx(i); }
  function handleDragOver(e, i) { e.preventDefault(); if (dragIdx === null || dragIdx === i) return; const newOrder = [...order]; const item = newOrder.splice(dragIdx, 1)[0]; newOrder.splice(i, 0, item); setOrder(newOrder); setDragIdx(i); }
  function handleDragEnd() { setDragIdx(null); }
  function check() {
    const isCorrect = order.every((item, i) => item === correctOrder[i]);
    setCorrect(isCorrect);
    setChecked(true);
    if (isCorrect && onComplete) onComplete();
  }
  function reset() { setOrder([...items].sort(() => Math.random() - 0.5)); setChecked(false); setCorrect(false); }

  return (
    <Card style={{ margin: "18px 0", border: checked ? `2px solid ${correct ? P.correct : P.wrong}` : `1px solid ${P.border}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: P.navy, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: P.textMid, marginBottom: 14 }}>{instruction}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {order.map((item, i) => (
          <div key={item} draggable onDragStart={() => handleDragStart(i)} onDragOver={(e) => handleDragOver(e, i)} onDragEnd={handleDragEnd}
            style={{ padding: "12px 16px", borderRadius: 8, background: checked ? (item === correctOrder[i] ? P.correctBg : P.wrongBg) : (dragIdx === i ? P.tealPale : "#f8f9fb"), border: `1px solid ${checked ? (item === correctOrder[i] ? P.correct : P.wrong) : P.border}`, cursor: checked ? "default" : "grab", display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s", userSelect: "none" }}>
            <span style={{ width: 24, height: 24, borderRadius: "50%", background: checked ? (item === correctOrder[i] ? P.correct : P.wrong) : P.teal, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
            <span style={{ fontSize: 14, color: P.text }}>{item}</span>
            {!checked && <span style={{ marginLeft: "auto", color: P.textLight, fontSize: 16 }}>⠿</span>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        {!checked && <button onClick={check} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: P.teal, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Check Order</button>}
        {checked && !correct && <button onClick={reset} style={{ padding: "8px 20px", borderRadius: 8, border: `1px solid ${P.border}`, background: P.white, color: P.navy, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Try Again</button>}
        {checked && correct && <div style={{ fontSize: 14, fontWeight: 600, color: P.correct }}>✓ Perfect!</div>}
      </div>
    </Card>
  );
}

// ─── INTERACTIVE: CALCULATION ───────────────────────────────────────
function CalcExercise({ title, scenario, fields, validate, explanation }) {
  const [values, setValues] = useState({});
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState(null);

  function check() {
    const r = validate(values);
    setResult(r);
    setChecked(true);
  }
  function reset() { setValues({}); setChecked(false); setResult(null); }

  return (
    <Card style={{ margin: "18px 0", border: checked ? `2px solid ${result?.correct ? P.correct : P.wrong}` : `1px solid ${P.border}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: P.navy, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 14, color: P.text, lineHeight: 1.7, marginBottom: 16, whiteSpace: "pre-line" }}>{scenario}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {fields.map(f => (
          <label key={f.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 14, color: P.textMid, minWidth: 180 }}>{f.label}</span>
            <div style={{ position: "relative", flex: 1 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: P.textLight, fontSize: 14 }}>£</span>
              <input type="number" value={values[f.id] || ""} onChange={e => setValues({ ...values, [f.id]: Number(e.target.value) })} disabled={checked}
                style={{ width: "100%", padding: "10px 12px 10px 28px", borderRadius: 8, border: `1px solid ${checked ? (result?.fieldResults?.[f.id] ? P.correct : P.wrong) : P.border}`, fontSize: 15, fontWeight: 600, color: P.navy, boxSizing: "border-box", background: checked ? (result?.fieldResults?.[f.id] ? P.correctBg : P.wrongBg) : P.white }} />
            </div>
          </label>
        ))}
      </div>
      {!checked && <button onClick={check} style={{ marginTop: 14, padding: "8px 20px", borderRadius: 8, border: "none", background: P.teal, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Check</button>}
      {checked && (
        <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 8, background: result?.correct ? P.correctBg : P.wrongBg, borderLeft: `3px solid ${result?.correct ? P.correct : P.wrong}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: result?.correct ? P.correct : P.wrong, marginBottom: 4 }}>{result?.correct ? "✓ Correct!" : "✗ Not quite"}</div>
          <div style={{ fontSize: 14, lineHeight: 1.7, color: P.text }}>{result?.message || explanation}</div>
          {!result?.correct && <button onClick={reset} style={{ marginTop: 10, padding: "6px 16px", borderRadius: 6, border: `1px solid ${P.border}`, background: P.white, color: P.navy, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Retry</button>}
        </div>
      )}
    </Card>
  );
}

// ─── INTERACTIVE: PREDICT & REVEAL ──────────────────────────────────
function PredictReveal({ question, options, correctIdx, explanation }) {
  const [sel, setSel] = useState(null);
  const [revealed, setRevealed] = useState(false);
  function pick(i) { if (revealed) return; setSel(i); setRevealed(true); }
  return (
    <Card style={{ margin: "18px 0" }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: P.navy, marginBottom: 12, lineHeight: 1.5 }}>{question}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((o, i) => {
          let bg = "#f8f9fb", bd = P.border, tc = P.text;
          if (revealed) { if (i === correctIdx) { bg = P.correctBg; bd = P.correct; tc = P.correct; } else if (i === sel) { bg = P.wrongBg; bd = P.wrong; tc = P.wrong; } else { tc = P.textLight; } }
          return <button key={i} onClick={() => pick(i)} style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${bd}`, background: bg, textAlign: "left", cursor: revealed ? "default" : "pointer", fontSize: 14, color: tc, fontWeight: revealed && i === correctIdx ? 700 : 400, lineHeight: 1.5 }}>{o}</button>;
        })}
      </div>
      {revealed && <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, background: sel === correctIdx ? P.correctBg : P.wrongBg, fontSize: 14, lineHeight: 1.7, color: P.text }}>{explanation}</div>}
    </Card>
  );
}

// ─── LEARNING CONTENT ───────────────────────────────────────────────
function LearnContent({ id }) {
  switch (id) {
    case "overview": return (<>
      <Title>Section 4: Payment</Title><Sub>The financial engine of the SBC/Q 2024</Sub>
      <Pg>Section 4 is the longest and most operationally significant part of the SBC/Q 2024. It governs how the Contractor gets paid, how the Employer retains financial security against defective work, and how payment disputes are managed throughout the life of the project.</Pg>
      <Pg>The payment provisions are built on the framework established by the <strong>Housing Grants, Construction and Regeneration Act 1996</strong> (as amended by the Local Democracy, Economic Development and Construction Act 2009). This legislation requires construction contracts to include provisions for stage or periodic payments, adequate payment notice mechanisms, and the right to suspend performance for non-payment.</Pg>
      <H3>How This Module Works</H3>
      <Pg>Each section follows a consistent structure: first we <strong>explain the principles</strong> and the relevant clauses, then we <strong>illustrate with examples</strong>, and finally you <strong>practise</strong> through interactive exercises. Once you've worked through all five learning sections, the final tab — the <strong>Simulator</strong> — puts you in the role of the Architect/Contract Administrator managing a live project's payment cycle.</Pg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px 0" }}>
        {[{ t: "Contract Sum", c: "4.1–4.4", d: "Lump sum rules, what can be adjusted" }, { t: "Payment Cycle", c: "4.7–4.13", d: "Due dates, certificates, notices, suspension" }, { t: "Valuation & Retention", c: "4.14–4.19", d: "Gross valuation, retention at 3%" }, { t: "Loss & Expense", c: "4.20–4.24", d: "Relevant Matters vs Relevant Events" }, { t: "Final Account", c: "4.25–4.26", d: "Final Certificate, conclusive effect" }].map((x, i) => <Card key={i} style={{ padding: "14px 16px" }}><div style={{ fontSize: 11, fontWeight: 700, color: P.teal, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{x.c}</div><div style={{ fontSize: 14, fontWeight: 700, color: P.navy, marginBottom: 4 }}>{x.t}</div><div style={{ fontSize: 13, color: P.textMid, lineHeight: 1.4 }}>{x.d}</div></Card>)}
      </div>
      <Tip icon="⚠️" title="Key Changes in the 2024 Edition" accent={P.gold} bg={P.goldPale}>
        The 2024 edition introduced significant changes to the payment mechanics. Due dates are now fixed at 7 days after the Interim Valuation Date. The default retention rate is 3%. Pay Less Notices must now be given even if the amount is zero. Both parties — not just the Employer — can now issue Pay Less Notices against the Final Certificate.
      </Tip>
    </>);

    case "contract-sum": return (<>
      <Title>Contract Sum & Adjustments</Title><Sub>Clauses 4.1–4.4</Sub>

      <H3>The Principle</H3>
      <Pg>The SBC/Q is a <strong>lump sum contract</strong>. This is the foundational concept underpinning the entire payment structure. The Contractor prices the work based on the bills of quantities prepared by the Employer's Quantity Surveyor and, in doing so, takes the risk that the work may cost more than the price it has allowed.</Pg>
      <Pg>The lump sum is governed by three interlocking clauses that create what practitioners often call a <strong>"closed system"</strong>:</Pg>
      <Pg><strong>Clause 4.1</strong> defines what is included in the Contract Sum: the quality and quantity of work as set out in the Contract Bills and, where a Contractor's Designed Portion (CDP) applies, the CDP documents (Employer's Requirements, Contractor's Proposals, and CDP Analysis).</Pg>
      <Pg><strong>Clause 4.2</strong> is the lock: the Contract Sum shall not be adjusted or altered in any way <em>other than in accordance with the express provisions of the Conditions</em>. Crucially, any error in computation of the Contract Sum — whether in the Contractor's favour or the Employer's — is deemed accepted by the Parties.</Pg>
      <Pg><strong>Clause 4.3</strong> then lists every permitted adjustment: variations (Cl. 3.14), acceleration quotations (Schedule 2), fluctuations (where applicable), loss and expense (Cl. 4.20), expenditure of Provisional Sums, and any other amounts expressly provided for. Clause 4.4 requires that each adjustment, once ascertained in whole or in part, must be taken into account in the next Interim Certificate.</Pg>

      <H3>Example</H3>
      <Pg>A Contractor submits a tender of £4,200,000 for a school extension. After contract award, the Contractor realises it underpriced the mechanical and electrical package by £150,000. Under Clause 4.2, this error is accepted — neither party can re-open the Contract Sum on this basis. The Contractor bears that risk.</Pg>
      <Pg>However, if during construction the Architect instructs an additional server room as a variation under Clause 3.14, the value of that variation is a permitted adjustment under Clause 4.3 and will be added to the Contract Sum.</Pg>
      <Pg>The Contract Sum is stated <strong>exclusive of VAT</strong> (Clause 4.5). Where the Employer is a 'contractor' for Construction Industry Scheme (CIS) purposes, payments are subject to the CIS provisions (Clause 4.6).</Pg>

      <Tip icon="💡" title="Why This Matters">The closed system means neither party can adjust the price unless a specific clause authorises it. For the Contractor, this means underpricing is its own risk. For the Employer, it means deductions can only be made where the Conditions expressly allow — not simply because the Employer considers the price too high.</Tip>

      <H3>Test Yourself</H3>
      <SortExercise title="📋 Sort: Which adjustments are permitted under Cl. 4.3?" instruction="Drag the permitted adjustments to the top (first 4 items) and items that are NOT permitted to the bottom." items={["Variations instructed under Cl. 3.14", "Loss & expense under Cl. 4.20", "Fluctuations (where applicable)", "Provisional Sum expenditure", "Contractor's underpricing of preliminaries", "Employer's request for a discount", "Cost overrun on materials", "Contractor's overhead increases"]} correctOrder={["Variations instructed under Cl. 3.14", "Loss & expense under Cl. 4.20", "Fluctuations (where applicable)", "Provisional Sum expenditure", "Contractor's underpricing of preliminaries", "Employer's request for a discount", "Cost overrun on materials", "Contractor's overhead increases"]} />
    </>);

    case "payment-cycle": return (<>
      <Title>The Payment Cycle</Title><Sub>Clauses 4.7–4.13</Sub>

      <H3>The Principle</H3>
      <Pg>Every month during the construction phase, a strict sequence of dates and deadlines governs how interim payments are made. This cycle is driven by the <strong>Interim Valuation Date (IVD)</strong> — a fixed date each month stated in the Contract Particulars (JCT recommends the first IVD be no more than one month after the Date of Possession).</Pg>
      <Pg>The key dates are:</Pg>
      <Pg><strong>The IVD</strong> — The Contractor may submit a Payment Application to the Quantity Surveyor on or before this date (Cl. 4.10.1), stating the sum it considers due and the basis of calculation.</Pg>
      <Pg><strong>The Due Date (IVD + 7 days)</strong> — Fixed under Clause 4.8. This is a change from the 2016 edition, where due dates were stipulated differently.</Pg>
      <Pg><strong>Interim Certificate (due date + 5 days)</strong> — The Architect/CA must issue an Interim Certificate within 5 days of the due date, stating the sum considered due and the calculation basis (Cl. 4.9.1).</Pg>
      <Pg><strong>Pay Less Notice deadline (final date − 5 days)</strong> — If either party intends to pay less than the amount in the certificate, it must issue a Pay Less Notice not later than 5 days before the final date for payment (Cl. 4.11.5). In the 2024 edition, this notice must be given even if the amount is zero.</Pg>
      <Pg><strong>Final Date for Payment (due date + 14 days)</strong> — The Employer must pay the certified sum (or the amount in any valid Pay Less Notice) by this date (Cl. 4.11.1).</Pg>

      <H3>What If the Certificate Is Late?</H3>
      <Pg>The contract has two fallback mechanisms under Clause 4.10.2:</Pg>
      <Pg><strong>If the Contractor made a Payment Application</strong> and no certificate is issued, that application automatically serves as a Payment Notice (Cl. 4.10.2.1). The final date for payment is NOT postponed — the Contractor already had its application in place.</Pg>
      <Pg><strong>If no Payment Application was made</strong>, the Contractor may issue a separate Payment Notice at any time after the certificate was due (Cl. 4.10.2.2). In this case, the final date for payment IS postponed by the period of delay (Cl. 4.11.4).</Pg>

      <H3>Right of Suspension</H3>
      <Pg>If the Employer fails to pay by the final date for payment, the Contractor may suspend performance of its obligations after giving <strong>7 days' notice</strong> (Cl. 4.13). The Contractor is entitled to recover reasonable costs arising from the suspension and can claim an extension of time.</Pg>

      <H3>Example</H3>
      <Pg>The Interim Valuation Date is 25 March. The Contractor submits a Payment Application on 24 March. The due date is 1 April (25 Mar + 7). The Architect/CA must issue the certificate by 6 April (1 Apr + 5). The Pay Less Notice deadline is 10 April (15 Apr − 5). The final date for payment is 15 April (1 Apr + 14). If the Employer has not paid by 15 April, the Contractor can give 7 days' notice of suspension.</Pg>

      <Tip icon="⚠️" title="Pay Less Notices" accent={P.gold} bg={P.goldPale}>
        A Pay Less Notice is not a discretionary device for managing cash flow. It must specify the sum the payer considers due and the <strong>basis on which that sum is calculated</strong> (Cl. 4.12.1). Valid bases include genuine valuation differences, defects, contractual set-offs, or liquidated damages. A lack of funds is NOT a legitimate basis — the Employer's obligation to fund the project is its own risk.
      </Tip>

      <H3>Test Yourself</H3>
      <SortExercise title="📅 Put the payment cycle in order" instruction="Drag these events into the correct chronological sequence." items={["Contractor submits Payment Application", "Interim Valuation Date", "Due Date (IVD + 7 days)", "Architect/CA issues Interim Certificate (within 5 days of due date)", "Pay Less Notice deadline (5 days before final date)", "Final Date for Payment (due date + 14 days)"]} correctOrder={["Contractor submits Payment Application", "Interim Valuation Date", "Due Date (IVD + 7 days)", "Architect/CA issues Interim Certificate (within 5 days of due date)", "Pay Less Notice deadline (5 days before final date)", "Final Date for Payment (due date + 14 days)"]} />
      <PredictReveal question="A Pay Less Notice must be given even if the amount the payer intends to pay is zero. True or false?" options={["True — the 2024 edition requires this", "False — a Pay Less Notice is only needed when reducing a positive amount"]} correctIdx={0} explanation="Correct. Clause 4.11.5 requires a Pay Less Notice even if the amount is zero. This is a key change in the 2024 edition. Both parties — not just the Employer — can now issue Pay Less Notices against the Final Certificate." />
    </>);

    case "valuation": return (<>
      <Title>Valuation & Retention</Title><Sub>Clauses 4.14–4.19</Sub>

      <H3>The Principle — Gross Valuation</H3>
      <Pg>The Gross Valuation is the cumulative total of all amounts from which retention is deducted and previous payments subtracted to arrive at the sum due in each Interim Certificate. It is built from three components defined in Clause 4.14:</Pg>
      <Pg><strong>Items subject to Retention (Cl. 4.14.1):</strong> Work properly executed, Site Materials adequately protected and not prematurely on site, and Listed Items that meet the conditions in Clause 4.16. These amounts are adjusted for fluctuations and acceleration quotations where applicable.</Pg>
      <Pg><strong>Items NOT subject to Retention (Cl. 4.14.2):</strong> Insurance costs, statutory fees and charges, loss and expense amounts ascertained under Clause 4.20, reinstatement costs, and fluctuations payments. These are paid in full — no retention is deducted.</Pg>
      <Pg><strong>Deductions (Cl. 4.14.3):</strong> Amounts deductible for setting out errors, defective work, non-compliance with instructions, and certain insurance-related matters.</Pg>
      <Pg>Under Clause 4.15, the sum due as an interim payment is then: <strong>Gross Valuation − Retention − Advance Payment reimbursement − Previous Certificates − Any Payment Notice amount since the last certificate</strong>.</Pg>

      <H3>The Principle — Retention</H3>
      <Pg>Retention is the Employer's financial security against defective work. The 2024 edition sets the default Retention Percentage at <strong>3%</strong> (Cl. 4.19.1, Contract Particulars). The Employer holds retention money as a <strong>fiduciary trustee</strong> for the Contractor (Cl. 4.17.1), though without obligation to invest. The Contractor can request the retention be placed in a separate designated bank account (Cl. 4.17.3), except where the Employer is a local or public authority.</Pg>
      <Pg>Retention operates in stages (Cl. 4.19):</Pg>
      <Pg><strong>Before Practical Completion:</strong> The full Retention Percentage (3%) is deducted from items under Cl. 4.14.1.</Pg>
      <Pg><strong>After Practical Completion:</strong> Only half the Retention Percentage (1.5%) may be deducted — meaning half the accumulated retention is released in the next certificate after Practical Completion (Cl. 4.19.2).</Pg>
      <Pg><strong>After the Certificate of Making Good:</strong> The remaining retention is released — no further deduction is permissible.</Pg>
      <Pg>As an alternative to cash retention, the Contractor may provide a <strong>Retention Bond</strong> in the form set out in Part 3 of Schedule 6 (Cl. 4.18), allowing the full certified amount to be paid without deduction.</Pg>

      <H3>Worked Example</H3>
      <Pg>A Quantity Surveyor prepares a Month 6 valuation showing: work properly executed £520,000; Site Materials £18,000; loss and expense ascertained £12,000. Previous certificates total £380,000. Retention rate: 3%.</Pg>
      <Pg>Step 1: Items subject to retention = £520,000 + £18,000 = £538,000.</Pg>
      <Pg>Step 2: Retention = £538,000 × 3% = £16,140.</Pg>
      <Pg>Step 3: Net of retention = £538,000 − £16,140 = £521,860.</Pg>
      <Pg>Step 4: Add items not subject to retention = £521,860 + £12,000 = £533,860.</Pg>
      <Pg>Step 5: Deduct previous certificates = £533,860 − £380,000 = <strong>£153,860 due this period</strong>.</Pg>

      <H3>Test Yourself</H3>
      <CalcExercise title="🧮 Calculate the Interim Certificate" scenario={"A different month. The Quantity Surveyor's valuation shows:\n• Work executed: £520,000\n• Site Materials: £18,000\n• Loss & expense: £12,000\n• Previous certificates: £380,000\n\nRetention rate: 3%. Calculate:"} fields={[{ id: "retention", label: "Retention deducted:" }, { id: "due", label: "Sum due this period:" }]} validate={(v) => {
        const retItems = 520000 + 18000;
        const retention = retItems * 0.03;
        const gross = retItems - retention + 12000;
        const due = gross - 380000;
        const retOk = Math.abs((v.retention || 0) - retention) < 10;
        const dueOk = Math.abs((v.due || 0) - due) < 10;
        return { correct: retOk && dueOk, fieldResults: { retention: retOk, due: dueOk }, message: retOk && dueOk ? `Correct! Retention on £538,000 = £${retention.toLocaleString()}. Gross less retention = £${(retItems - retention).toLocaleString()} + £12,000 (loss and expense, no retention) = £${gross.toLocaleString()}. Less previous certs £380,000 = £${due.toLocaleString()}.` : `Retention applies only to work + materials (£538,000 × 3% = £${retention.toLocaleString()}). Loss and expense is NOT subject to retention (Cl. 4.14.2). Gross = £${(retItems - retention).toLocaleString()} + £12,000 = £${gross.toLocaleString()}. Less previous certs = £${due.toLocaleString()}.` };
      }} explanation="" />
    </>);

    case "loss-expense": return (<>
      <Title>Loss & Expense</Title><Sub>Clauses 4.20–4.24</Sub>

      <H3>The Principle</H3>
      <Pg>The loss and expense provisions allow the Contractor to recover <strong>direct</strong> financial loss caused by specified disruptions — the <strong>Relevant Matters</strong> listed in Clause 4.22. This is an important and frequently misunderstood area of the contract because it is separate from the extension of time provisions, which deal with <strong>Relevant Events</strong> listed in Clause 2.29.</Pg>
      <Pg>Under Clause 4.20.1, the Contractor is entitled to reimbursement of direct loss and/or expense if: (1) it has incurred or is likely to incur such loss; and (2) regular progress of the Works has been or is likely to be <strong>materially affected</strong> by a Relevant Matter, or by deferment of possession under Clause 2.5. The entitlement does not arise where the Conditions expressly exclude it, or where the Contractor is reimbursed under another provision (Cl. 4.20.2).</Pg>

      <H3>The Critical Distinction: Relevant Events vs Relevant Matters</H3>
      <Pg>Not every event that entitles the Contractor to more time also entitles it to more money. This is one of the most important principles in the SBC/Q:</Pg>
      <Pg><strong>Relevant Events (Cl. 2.29)</strong> — entitle the Contractor to an extension of time. The list includes variations, exceptionally adverse weather, force majeure, civil commotion, Specified Perils, epidemics, and other matters.</Pg>
      <Pg><strong>Relevant Matters (Cl. 4.22)</strong> — entitle the Contractor to loss and expense. The list is <em>shorter</em>. It includes variations (4.22.1), certain Architect/Contract Administrator (A/CA) instructions such as postponement and Provisional Sum expenditure (4.22.2), antiquities/contamination compliance (4.22.3), approximate quantity inaccuracy (4.22.4), and any impediment, prevention or default by the Employer, A/CA, Quantity Surveyor or Employer's Persons (4.22.5). Optional clauses for epidemics (4.22.6) and statutory powers (4.22.7) apply only where stated in the Contract Particulars.</Pg>
      <Pg>Crucially, <strong>exceptionally adverse weather, force majeure, and civil commotion are Relevant Events but NOT Relevant Matters</strong>. The Contractor gets more time but not more money for these events.</Pg>

      <H3>Example</H3>
      <Pg>A Contractor experiences a 6-week delay due to exceptional rainfall in October and a 3-week delay because the Architect issued structural drawings late. The Contractor is entitled to an extension of time for both (weather is a Relevant Event under Cl. 2.29, and late drawings fall under the impediment/default Relevant Event at Cl. 2.29.7).</Pg>
      <Pg>However, the Contractor can only claim loss and expense for the <strong>3-week late drawings delay</strong>, because this falls under the impediment/default Relevant Matter at Cl. 4.22.5. The weather delay gives time but no money — it is not on the Cl. 4.22 list.</Pg>

      <H3>Procedure (Cl. 4.21)</H3>
      <Pg>The Contractor must notify the Architect/CA as soon as the likely effect becomes or should have become reasonably apparent (Cl. 4.21.1). This must be accompanied by an initial assessment and supporting information (Cl. 4.21.2), with monthly updates thereafter (Cl. 4.21.3). The Architect/Contract Administrator or Quantity Surveyor must respond with an ascertained amount within 28 days of the initial submission and 14 days of each update (Cl. 4.21.4). Amounts ascertained are added to the Contract Sum (Cl. 4.23). The Contractor's other rights and remedies at common law are expressly preserved (Cl. 4.24).</Pg>

      <H3>Test Yourself</H3>
      <SortExercise title="⚖️ Sort: Relevant Matter or NOT?" instruction="Drag these so that Relevant Matters (money) are at the top (first 5), and non-qualifying events are at the bottom." items={["Variations (Cl. 4.22.1)", "A/CA instructions for postponement (Cl. 4.22.2)", "Antiquities/contamination compliance (Cl. 4.22.3)", "Approximate Quantity inaccuracy (Cl. 4.22.4)", "Impediment by Employer or Employer's Persons (Cl. 4.22.5)", "Exceptionally adverse weather", "Force majeure", "Civil commotion"]} correctOrder={["Variations (Cl. 4.22.1)", "A/CA instructions for postponement (Cl. 4.22.2)", "Antiquities/contamination compliance (Cl. 4.22.3)", "Approximate Quantity inaccuracy (Cl. 4.22.4)", "Impediment by Employer or Employer's Persons (Cl. 4.22.5)", "Exceptionally adverse weather", "Force majeure", "Civil commotion"]} />
    </>);

    case "final-account": return (<>
      <Title>Final Account & Final Certificate</Title><Sub>Clauses 4.25–4.26</Sub>

      <H3>The Principle</H3>
      <Pg>After Practical Completion, a defined sequence of time-limited steps leads to the issue of the <strong>Final Certificate</strong> — which has powerful <strong>conclusive effect</strong> under Clause 1.9. Understanding these time limits is critical because missing them can result in the loss of contractual rights.</Pg>

      <H3>The Final Account Timeline</H3>
      <Pg><strong>Step 1 — Contractor provides documents (Cl. 4.25.1):</strong> Within <strong>6 months</strong> of the Practical Completion Certificate (or last Section Completion Certificate), the Contractor must provide all documents necessary for adjusting the Contract Sum. If the Contractor fails to do so, the Architect/CA can give one month's notice requiring them (Cl. 4.25.3), after which the final account may be completed on the basis of information already available.</Pg>
      <Pg><strong>Step 2 — Quantity Surveyor prepares the statement (Cl. 4.25.2):</strong> Within <strong>3 months</strong> of receiving the Contractor's documents, the Quantity Surveyor prepares the final adjustment statement and the Architect/CA ascertains any outstanding loss and expense.</Pg>
      <Pg><strong>Step 3 — Final Certificate (Cl. 4.26.1):</strong> The Architect/CA must issue the Final Certificate within <strong>2 months</strong> of whichever occurs last of: the end of the Rectification Period, the Certificate of Making Good, or the sending of the final adjustment statement. The certificate states the adjusted Contract Sum and the total of all previous interim payments, showing the balance due to either party.</Pg>

      <H3>Conclusive Effect (Cl. 1.9)</H3>
      <Pg>The Final Certificate serves as conclusive evidence that:</Pg>
      <Pg>• Quality and standards requiring the Architect/CA's approval were to its reasonable satisfaction;</Pg>
      <Pg>• All required Contract Sum adjustments have been given effect;</Pg>
      <Pg>• All due extensions of time have been given;</Pg>
      <Pg>• Loss and expense amounts are in final settlement of all Relevant Matter claims.</Pg>
      <Pg>However, this conclusive effect is <strong>subject to Clause 1.9.2</strong>: it does not apply where proceedings are commenced before the certificate is issued, or within <strong>28 days</strong> (for adjudication), or within the <strong>relevant limitation period</strong> (for arbitration or legal proceedings). Fraud and arithmetical errors are also exceptions.</Pg>

      <H3>Example</H3>
      <Pg>The Final Certificate is issued on 1 June showing a balance of £75,200 due to the Contractor. Three weeks later (22 June), the Contractor identifies an additional loss and expense claim of £35,000. Because only 21 days have passed, the 28-day adjudication window under Cl. 1.9.2 is still open. The Contractor can commence adjudication to challenge the conclusive effect. Had the Contractor waited until 30 June (29 days), the adjudication window would have closed and the conclusive effect would bar the claim — though the Contractor might still commence arbitration or legal proceedings within the relevant limitation period.</Pg>

      <H3>Test Yourself</H3>
      <SortExercise title="⏱️ Put the final account timeline in order" instruction="Arrange these steps in the correct sequence." items={["Practical Completion Certificate issued", "Contractor provides final account documents (within 6 months of Practical Completion)", "Quantity Surveyor prepares final adjustment statement (within 3 months of receiving documents)", "Architect/CA issues Final Certificate (within 2 months of latest trigger)", "Conclusive effect takes hold (subject to Cl. 1.9.2 challenge windows)"]} correctOrder={["Practical Completion Certificate issued", "Contractor provides final account documents (within 6 months of Practical Completion)", "Quantity Surveyor prepares final adjustment statement (within 3 months of receiving documents)", "Architect/CA issues Final Certificate (within 2 months of latest trigger)", "Conclusive effect takes hold (subject to Cl. 1.9.2 challenge windows)"]} />
      <PredictReveal question="What is the latest trigger for the 2-month Final Certificate deadline?" options={["End of the Rectification Period only", "Whichever is latest: end of Rectification Period, Certificate of Making Good, or the final adjustment statement", "The date the Contractor submits final documents"]} correctIdx={1} explanation="Clause 4.26.1: the Final Certificate must be issued within 2 months of whichever occurs last of these three events." />
    </>);

    default: return null;
  }
}

// ─── SIMULATOR: EMAIL INBOX ─────────────────────────────────────────
const EMAILS = [
  { id: 1, month: "Mar", from: "Maria Chen (Quantity Surveyor)", subject: "IVP 3 — Valuation Ready", role: "qs",
    body: `Hi,\n\nThe Month 3 valuation is ready for your certificate:\n\n• Work properly executed: £380,000\n• Site Materials on site: £22,000\n• No variations, no loss and expense claims\n• Contractor's Payment Application received yesterday: £402,000\n\nPlease confirm the certificate amount.\n\nRetention: 3% | Interim Valuation Date: 25 March | No advance payment.`,
    type: "calc",
    fields: [{ id: "due_date", label: "Due date (day in April)", unit: "", hint: "Interim Valuation Date + 7 days" }, { id: "cert_amount", label: "Certificate amount (£)", unit: "£", hint: "Gross − retention" }],
    validate: (v) => {
      const dateOk = Number(v.due_date) === 1;
      const amtOk = Math.abs(Number(v.cert_amount) - 389940) < 50;
      return { correct: dateOk && amtOk, fieldResults: { due_date: dateOk, cert_amount: amtOk },
        message: dateOk && amtOk ? "Correct! Due date = 25 Mar + 7 = 1 April. Gross = £402,000. Retention 3% = £12,060. Certificate = £389,940. You must issue by 6 April (due date + 5 days, Cl. 4.9.1)."
        : `Due date = Interim Valuation Date + 7 = 1 April (Cl. 4.8). Retention on £402,000 at 3% = £12,060. Certificate = £389,940. ${!dateOk ? "The due date is 7 days after the Interim Valuation Date, not the date itself." : ""} ${!amtOk ? "Remember to deduct 3% retention from work + materials." : ""}` };
    }, points: 10 },

  { id: 2, month: "May", from: "Tom Harris (Hartwell)", subject: "RE: Where is our May certificate?", role: "contractor",
    body: `Hi,\n\nWe submitted our Payment Application for £185,000 on 24 April. The due date was 1 May and we expected your certificate by 6 May.\n\nIt is now 9 May and we haven't received anything. Please advise on the position immediately.\n\nRegards,\nTom Harris\nCommercial Director, Hartwell Construction`,
    type: "choice",
    question: "How do you respond?",
    options: [
      { label: "Apologise and issue a backdated certificate for 6 May", feedback: "Certificates cannot be backdated. The contract has a specific fallback mechanism.", points: 1 },
      { label: "Explain that your Payment Application now serves as a Payment Notice under Cl. 4.10.2.1. The final date for payment (15 May) is unchanged since you already had a Payment Application in place. Issue a Pay Less Notice by 10 May if paying a different amount.", feedback: "Correct! Since the Contractor made a Payment Application, it automatically becomes a Payment Notice (Cl. 4.10.2.1). The final date is NOT postponed because the Payment Application was already in place. You need to issue a Pay Less Notice by 10 May (5 days before 15 May) if you want to pay differently.", points: 10, correct: true },
      { label: "Tell the Contractor to submit a new Payment Application", feedback: "Not needed. The original Payment Application has already become a Payment Notice automatically under Cl. 4.10.2.1.", points: 0 },
    ], points: 10 },

  { id: 3, month: "Jul", from: "Maria Chen (Quantity Surveyor)", subject: "IVP 7 — Variation + Loss & Expense in valuation", role: "qs",
    body: `Hi,\n\nThe Month 7 Gross Valuation includes the server room variation:\n\n• Work (incl. variation): £285,000 this period\n• Site Materials: £8,000 this period\n• Loss & expense ascertained: £12,500\n• Previous certificates total: £1,650,000\n• Cumulative work to date: £2,180,000\n• Cumulative materials to date: £62,000\n\nPlease calculate this month's certificate. Remember, the valuation is cumulative.`,
    type: "calc",
    fields: [{ id: "retention", label: "Cumulative retention (£)", unit: "£", hint: "3% of cumulative work + materials" }, { id: "cert", label: "This month's certificate (£)", unit: "£", hint: "Cumulative gross − retention + loss & expense − previous certs" }],
    validate: (v) => {
      const cumRet = (2180000 + 62000) * 0.03; // 67,260
      const cumGross = 2180000 + 62000 - cumRet + 12500; // 2,187,240
      const thisCert = cumGross - 1650000; // 537,240
      const retOk = Math.abs(Number(v.retention) - cumRet) < 100;
      const certOk = Math.abs(Number(v.cert) - thisCert) < 100;
      return { correct: retOk && certOk, fieldResults: { retention: retOk, cert: certOk },
        message: retOk && certOk ? `Correct! Cumulative retention = (£2,180,000 + £62,000) × 3% = £${cumRet.toLocaleString()}. Cumulative gross = £${(2180000+62000).toLocaleString()} − £${cumRet.toLocaleString()} + £12,500 (loss and expense, no retention) = £${cumGross.toLocaleString()}. Less previous certs = £${thisCert.toLocaleString()}.`
        : `Retention applies to cumulative work + materials (£2,242,000 × 3% = £${cumRet.toLocaleString()}). Loss and expense is NOT subject to retention. Cumulative net = £${cumGross.toLocaleString()}. This period = £${thisCert.toLocaleString()}.` };
    }, points: 10 },

  { id: 4, month: "Sep", from: "Sarah Webb (Employer)", subject: "Two payment issues this month", role: "employer",
    body: `Hi,\n\nTwo issues on the September certificate (£172,000 certified, due date 2 October, final date 16 October):\n\n1. Cash flow: Our finances are very tight this quarter. Can we pay only £150,000 and make up the difference next month?\n\n2. Defective brickwork: Your site inspection on 28 September found that approximately £8,000 of facing brickwork on the east elevation does not comply with the specification. The Quantity Surveyor confirms this work was included in the valuation.\n\nPlease advise on both.\n\nSarah Webb\nFinance Director, Greenfield Academy Trust`,
    type: "choice",
    question: "How do you advise the Employer on each issue?",
    options: [
      { label: "Issue a Pay Less Notice for both: reduce by £22,000 for cash flow and £8,000 for defects, paying £142,000", feedback: "Wrong. A lack of funds is NOT a valid basis for a Pay Less Notice. The notice must be grounded in the contract's valuation or deduction provisions (Cl. 4.12.1) — it cannot be used to manage the Employer's cash flow. Using it this way would likely be treated as a sham notice in adjudication, exposing the Employer to a 'smash and grab' award for the full certified amount plus interest. Only the defective brickwork deduction is contractually legitimate.", points: 2 },
      { label: "Cash flow is not a valid ground — the full certified sum must be paid by 16 October. But for the defective brickwork, issue a Pay Less Notice by 11 October deducting £8,000, specifying the defect and calculation basis. Certificate payable: £164,000.", feedback: "Correct! A Pay Less Notice must specify a sum the Employer considers due and the basis of calculation (Cl. 4.12.1). The basis must be contractually grounded — valuation disputes, defects, set-offs, or liquidated damages. A shortage of funds is an Employer risk and is not a legitimate deduction.\n\nHowever, the defective brickwork IS a valid basis: work not in accordance with the contract can be excluded from the valuation. The Employer must issue the Pay Less Notice by 11 October (5 days before the final date of 16 October per Cl. 4.11.5). Failure to pay the remaining £164,000 by 16 October would trigger interest (Cl. 4.11.6) and the Contractor's right to suspend (Cl. 4.13).", points: 10, correct: true },
      { label: "Neither issue justifies a Pay Less Notice — pay the full £172,000", feedback: "Partially wrong. While cash flow is indeed not a valid ground, defective work IS a legitimate basis for a Pay Less Notice. Work not in accordance with the contract can be excluded from the valuation. The Employer should issue a Pay Less Notice deducting the £8,000 of non-compliant brickwork.", points: 4 },
      { label: "Revise your certificate downward to £142,000 to cover both issues", feedback: "Never. The Architect/CA must certify the sum genuinely considered due at the valuation date. If work was included in error, the correct mechanism is a Pay Less Notice by the Employer, not a retrospective certificate revision. And cash flow is never a ground for reducing a certificate.", points: 0 },
    ], points: 10 },

  { id: 5, month: "Dec", from: "Tom Harris (Hartwell)", subject: "Loss & Expense Claim — £62,000", role: "contractor",
    body: `Hi,\n\nWe are submitting a loss & expense claim under Clause 4.20 for £62,000 covering prolongation costs.\n\nTwo matters materially affected regular progress:\n\n1. Exceptionally adverse weather (Oct–Nov): 6 weeks delay\n2. Late structural drawings for the server room (your office): 3 weeks delay\n\nWe claim the full 9-week prolongation cost of £62,000.\n\nRegards,\nTom Harris`,
    type: "choice",
    question: "How do you respond to this claim?",
    options: [
      { label: "Accept the full £62,000 — both matters caused genuine delay", feedback: "You must check each matter against the Relevant Matters list in Cl. 4.22. Weather is NOT on that list.", points: 2 },
      { label: "Reject the weather element (not a Relevant Matter under Cl. 4.22). Ascertain the direct loss and expense for the 3-week late drawings delay only under Cl. 4.22.5 (impediment/default by the Architect).", feedback: "Correct! Adverse weather is a Relevant Event (Cl. 2.29) giving time, but NOT a Relevant Matter giving money. Late issue of drawings by the Architect falls under Cl. 4.22.5 — 'any impediment, prevention or default, whether by act or omission, by the Employer, the Architect/Contract Administrator, the Quantity Surveyor or any Employer's Person'. You should ascertain the direct loss for the 3-week period only.", points: 10, correct: true },
      { label: "Reject the entire claim — loss & expense has no basis in the contract", feedback: "Wrong. Loss and expense is expressly provided for in Cl. 4.20–4.23. The late drawings claim is valid under Cl. 4.22.5.", points: 0 },
    ], points: 10 },

  { id: 6, month: "Jul+1", from: "Tom Harris (Hartwell)", subject: "Practical Completion achieved — when do we get retention back?", role: "contractor",
    body: `Hi,\n\nThe Works are complete and you've issued the Practical Completion Certificate (25 July). We've been deducting 3% retention throughout the project.\n\nCumulative retention held: £118,500.\n\nPlease confirm when this is released.\n\nRegards,\nTom`,
    type: "calc",
    fields: [{ id: "released", label: "Amount released now (£)", unit: "£", hint: "Half of total retention" }, { id: "held", label: "Amount still held (£)", unit: "£", hint: "Remainder until Making Good" }],
    validate: (v) => {
      const relOk = Math.abs(Number(v.released) - 59250) < 100;
      const heldOk = Math.abs(Number(v.held) - 59250) < 100;
      return { correct: relOk && heldOk, fieldResults: { released: relOk, held: heldOk },
        message: relOk && heldOk ? "Correct! Half (£59,250) is released at Practical Completion. The remaining £59,250 is held until the Certificate of Making Good (Cl. 4.19). The Employer holds retention as fiduciary trustee (Cl. 4.17.1)."
        : "At Practical Completion, only half the Retention Percentage is deductible (Cl. 4.19.2). So half of £118,500 = £59,250 is released, and £59,250 remains held until the Certificate of Making Good." };
    }, points: 10 },

  { id: 7, month: "Jan+2", from: "Maria Chen (Quantity Surveyor)", subject: "Final Account — time limits reminder", role: "qs",
    body: `Hi,\n\nThe Rectification Period has ended and you've issued the Certificate of Making Good.\n\nCan you confirm the time limits from here to the Final Certificate? The Contractor hasn't sent their final account documents yet.\n\nMaria`,
    type: "calc",
    fields: [{ id: "contractor_months", label: "Contractor's deadline (months from Practical Completion)", unit: "months", hint: "Cl. 4.25.1" }, { id: "qs_months", label: "Quantity Surveyor preparation time (months)", unit: "months", hint: "Cl. 4.25.2" }, { id: "cert_months", label: "Final Certificate deadline (months after latest trigger)", unit: "months", hint: "Cl. 4.26.1" }],
    validate: (v) => {
      const cOk = Number(v.contractor_months) === 6;
      const qOk = Number(v.qs_months) === 3;
      const fOk = Number(v.cert_months) === 2;
      return { correct: cOk && qOk && fOk, fieldResults: { contractor_months: cOk, qs_months: qOk, cert_months: fOk },
        message: cOk && qOk && fOk ? "Correct! Contractor: 6 months from Practical Completion for documents (Cl. 4.25.1). Quantity Surveyor: 3 months to prepare (Cl. 4.25.2). Final Certificate: 2 months after the latest of: end of Rectification Period, Certificate of Making Good, or adjustment statement (Cl. 4.26.1)."
        : "Contractor has 6 months from Practical Completion (Cl. 4.25.1). Quantity Surveyor has 3 months after receiving documents (Cl. 4.25.2). Final Certificate within 2 months of the latest trigger (Cl. 4.26.1)." };
    }, points: 10 },

  { id: 8, month: "Apr+2", from: "Tom Harris (Hartwell)", subject: "RE: Final Certificate — additional loss and expense claim", role: "contractor",
    body: `Hi,\n\nWe've reviewed the Final Certificate issued 3 weeks ago and believe an additional £35,000 of loss and expense for the late drawings was not included in the ascertainment.\n\nWe intend to pursue this. Please confirm the position.\n\nTom`,
    type: "choice",
    question: "What is the correct position?",
    options: [
      { label: "The Final Certificate is conclusive — the claim is barred", feedback: "Not necessarily. Cl. 1.9.2 provides challenge windows. The Contractor may still have time.", points: 4 },
      { label: "The Contractor can pursue this only by commencing adjudication within 28 days of the Final Certificate, or arbitration/legal proceedings within the limitation period. After those windows close, the conclusive effect bars the claim.", feedback: "Correct! The Final Certificate is conclusive evidence that loss and expense is in final settlement (Cl. 1.9.1.4). But Cl. 1.9.2 suspends this if proceedings are commenced within the time limits: 28 days for adjudication, or the limitation period for other proceedings. Since it's only been 3 weeks, the adjudication window is still open.", points: 10, correct: true },
      { label: "The claim can be brought at any time within 6 years — the Final Certificate is irrelevant", feedback: "The limitation period applies, but the Final Certificate's conclusive effect under Cl. 1.9.1 changes what can be proved. The Contractor must act within the Cl. 1.9.2 windows.", points: 2 },
    ], points: 10 },
];

function SimEmail({ email, state, onCalc, onChoice }) {
  const colors = { qs: P.teal, contractor: S.accent, employer: "#9b59b6" };
  const roleColor = colors[email.role] || P.teal;
  const answered = state?.answered;

  return (
    <div style={{ background: S.card, border: `1px solid ${answered ? (state.correct ? S.ok : S.bad) : S.bdr}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.3s" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.bdr}`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: roleColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{email.from[0]}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: S.pri }}>{email.from}</div>
          <div style={{ fontSize: 13, color: S.sec }}>{email.subject}</div>
        </div>
        <div style={{ fontSize: 12, color: S.dim, background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 6, fontWeight: 600 }}>{email.month}</div>
        {answered && <div style={{ fontSize: 14, fontWeight: 700, color: state.correct ? S.ok : S.bad }}>{state.points}/10</div>}
      </div>
      {/* Body */}
      <div style={{ padding: "18px 20px" }}>
        {email.body.split("\n").map((line, i) => line.trim() ? <p key={i} style={{ margin: i === 0 ? 0 : "8px 0 0", fontSize: 14, lineHeight: 1.7, color: S.pri, whiteSpace: line.startsWith("•") ? "pre" : "normal" }}>{line}</p> : <div key={i} style={{ height: 8 }} />)}
      </div>
      {/* Interaction */}
      <div style={{ padding: "0 20px 20px" }}>
        {email.type === "calc" && (
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.teal, marginBottom: 12 }}>📝 Your Response</div>
            {email.fields.map(f => (
              <label key={f.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: S.sec, minWidth: 200 }}>{f.label}</span>
                <input type="number" value={state?.values?.[f.id] || ""} disabled={answered}
                  onChange={e => onCalc(email.id, f.id, e.target.value)}
                  placeholder={f.hint}
                  style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: `1px solid ${answered ? (state.fieldResults?.[f.id] ? S.ok : S.bad) : S.bdr}`, background: answered ? (state.fieldResults?.[f.id] ? S.okBg : S.badBg) : "rgba(0,0,0,0.15)", color: S.pri, fontSize: 14, fontWeight: 600 }} />
              </label>
            ))}
            {!answered && <button onClick={() => onCalc(email.id, "__submit", null)} style={{ marginTop: 8, padding: "8px 20px", borderRadius: 8, border: "none", background: S.teal, color: S.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Submit</button>}
          </div>
        )}
        {email.type === "choice" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.teal, marginBottom: 10 }}>{email.question}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {email.options.map((o, i) => {
                let bg = "rgba(0,0,0,0.15)", bd = S.bdr, tc = S.pri;
                if (answered) { if (o.correct) { bg = S.okBg; bd = S.ok; tc = S.ok; } else if (i === state.selected) { bg = S.badBg; bd = S.bad; tc = S.bad; } else { tc = S.dim; } }
                return <button key={i} onClick={() => !answered && onChoice(email.id, i)} style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${bd}`, background: bg, textAlign: "left", cursor: answered ? "default" : "pointer", fontSize: 14, color: tc, fontWeight: answered && o.correct ? 700 : 400, lineHeight: 1.5 }}>{o.label}</button>;
              })}
            </div>
          </div>
        )}
        {answered && state.message && (
          <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 8, background: state.correct ? S.okBg : S.badBg, borderLeft: `3px solid ${state.correct ? S.ok : S.bad}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: state.correct ? S.ok : S.bad, marginBottom: 4 }}>{state.correct ? "✓ Correct" : "✗ Review"} — {state.points} pts</div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: S.pri }}>{state.message}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Simulator() {
  const [emailStates, setEmailStates] = useState({});
  const totalPts = Object.values(emailStates).reduce((a, s) => a + (s?.points || 0), 0);
  const answered = Object.values(emailStates).filter(s => s?.answered).length;

  function handleCalc(emailId, fieldId, value) {
    if (fieldId === "__submit") {
      const email = EMAILS.find(e => e.id === emailId);
      const vals = emailStates[emailId]?.values || {};
      const result = email.validate(vals);
      setEmailStates(prev => ({ ...prev, [emailId]: { ...prev[emailId], answered: true, correct: result.correct, points: result.correct ? 10 : 0, message: result.message, fieldResults: result.fieldResults } }));
    } else {
      setEmailStates(prev => ({ ...prev, [emailId]: { ...prev[emailId], values: { ...prev[emailId]?.values, [fieldId]: value } } }));
    }
  }

  function handleChoice(emailId, optIdx) {
    const email = EMAILS.find(e => e.id === emailId);
    const opt = email.options[optIdx];
    setEmailStates(prev => ({ ...prev, [emailId]: { answered: true, selected: optIdx, correct: !!opt.correct, points: opt.points, message: opt.feedback } }));
  }

  return (
    <div style={{ background: S.bg, borderRadius: 16, padding: "28px 24px", margin: "-24px -28px", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: S.pri, fontFamily: "'Playfair Display', Georgia, serif" }}>📬 Payment Inbox</div>
          <div style={{ fontSize: 13, color: S.sec, marginTop: 4 }}>Greenfield Academy — £4.2M School Extension | You are the Architect/CA</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: 1 }}>Handled</div><div style={{ fontSize: 15, fontWeight: 700, color: S.accent }}>{answered}/8</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: 1 }}>Score</div><div style={{ fontSize: 15, fontWeight: 700, color: S.teal }}>{totalPts}/80</div></div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {EMAILS.map(e => <SimEmail key={e.id} email={e} state={emailStates[e.id]} onCalc={handleCalc} onChoice={handleChoice} />)}
      </div>
      {answered === 8 && (
        <div style={{ background: S.card, border: `1px solid ${S.bdr}`, borderRadius: 14, padding: "36px 28px", textAlign: "center", marginTop: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{totalPts >= 72 ? "🏆" : totalPts >= 56 ? "🎓" : "📚"}</div>
          <div style={{ fontSize: 38, fontWeight: 800, color: S.accent }}>{totalPts}/80</div>
          <div style={{ fontSize: 15, color: S.sec, marginTop: 10, lineHeight: 1.7 }}>
            {totalPts >= 72 ? "Outstanding — you handled every situation correctly." : totalPts >= 56 ? "Strong performance. Review the emails you got wrong." : "Review the learning module and try the inbox again."}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────────────
function Sidebar({ current, setCurrent }) {
  return (
    <nav style={{ width: 240, minHeight: "100%", background: P.navy, padding: "24px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${P.navyLight}` }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: P.gold, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Module 6</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: P.white, lineHeight: 1.3 }}>Payment</div>
      </div>
      <div style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
        {SECTIONS.map((s, i) => {
          const active = i === current;
          const isSim = s.id === "simulator";
          return (
            <button key={s.id} onClick={() => setCurrent(i)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 20px", background: active ? P.navyLight : "transparent", border: "none", borderLeft: active ? `3px solid ${isSim ? P.gold : P.tealLight}` : "3px solid transparent", cursor: "pointer", textAlign: "left" }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isSim ? 12 : 11, fontWeight: 600, flexShrink: 0, background: isSim ? (active ? P.gold : P.navyLight) : (active ? P.teal : P.navyLight), color: P.white }}>{isSim ? "▶" : i + 1}</span>
              <div><div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? P.white : P.textLight }}>{s.title}</div><div style={{ fontSize: 10, color: P.textLight, marginTop: 1 }}>{s.sub}</div></div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── MAIN ───────────────────────────────────────────────────────────
export default function Module6() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [current]);
  const sid = SECTIONS[current].id;

  return (
    <>
      <BackLink />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", background: P.cream, overflow: "hidden" }}>
        <Sidebar current={current} setCurrent={setCurrent} />
        <main ref={ref} style={{ flex: 1, overflowY: "auto", padding: "32px 44px 60px" }}>
          <Bar v={current + 1} max={SECTIONS.length} />
          <div style={{ maxWidth: 760, margin: "24px auto 0" }}>
            <LearnContent id={sid} /><NavBtn current={current} set={setCurrent} total={SECTIONS.length} />
          </div>
        </main>
      </div>
    </>
  );
}
