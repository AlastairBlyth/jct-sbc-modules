import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   JCT SBC/Q 2024 — Payment Assistant
   
   A practical tool for administering SBC/Q 2024 payment provisions.
   Five tools: Timeline Calculator, Certificate Calculator, Notice
   Drafter, Situation Advisor (AI), and Final Account Tracker.
   ═══════════════════════════════════════════════════════════════════════ */

const P = { navy: "#0f2a44", navyLight: "#1a3d5c", teal: "#1a8a7d", tealLight: "#2bb5a4", tealPale: "#e8f6f4", gold: "#d4a843", goldPale: "#fdf6e3", cream: "#faf8f5", white: "#ffffff", text: "#1e2a3a", textMid: "#4a5c6e", textLight: "#7a8c9e", border: "#dde3ea", correct: "#22855b", correctBg: "#e8f5ef", wrong: "#c0392b", wrongBg: "#fdeaea", shadow: "0 2px 16px rgba(15,42,68,0.07)" };
const A = { bg: "#0d1f35", card: "#142a45", cardHover: "#1a3458", accent: "#e8a838", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", bdr: "#1e3a5f", userBg: "#1a5276", aiBg: "#1a3a52" };

// ─── DATE UTILITIES ─────────────────────────────────────────────────
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function subtractDays(d, n) { return addDays(d, -n); }
function fmt(d) { if (!d) return "—"; return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
function fmtShort(d) { if (!d) return "—"; return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); }
function parseDate(s) { if (!s) return null; const d = new Date(s + "T00:00:00"); return isNaN(d.getTime()) ? null : d; }
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }
function isWeekend(d) { const day = d.getDay(); return day === 0 || day === 6; }

// ─── SYSTEM PROMPT FOR AI ADVISOR ───────────────────────────────────
const SYSTEM_PROMPT = `You are a JCT SBC/Q 2024 Payment Assistant — an expert in the payment provisions of the JCT Standard Building Contract With Quantities 2024.

Your role is to help Architects/Contract Administrators, Quantity Surveyors, Employers, and Contractors navigate real-world payment situations under the SBC/Q 2024.

KEY CONTRACT PROVISIONS YOU KNOW:
- Contract Sum (Cl. 4.1–4.4): Lump sum, adjustable only under the Conditions
- Due dates (Cl. 4.8): 7 days after the Interim Valuation Date
- Interim Certificates (Cl. 4.9): Issued within 5 days of the due date
- Payment Applications (Cl. 4.10): Contractor submits before IVD; becomes Payment Notice if no certificate issued
- Final date for payment (Cl. 4.11.1): 14 days from due date
- Pay Less Notices (Cl. 4.11.5, 4.12): Must specify sum and basis; required even if amount is zero; deadline is 5 days before final date
- Right of suspension (Cl. 4.13): 7 days' notice after failure to pay by final date
- Gross Valuation (Cl. 4.14): Items subject to retention vs not subject to retention
- Retention (Cl. 4.17–4.19): Default 3%; half released at Practical Completion; remainder after Certificate of Making Good; Employer holds as fiduciary trustee
- Loss and Expense (Cl. 4.20–4.24): Relevant Matters in Cl. 4.22; 28-day initial response, 14-day updates
- Final Certificate (Cl. 4.26): Within 2 months of latest of: end of Rectification Period, Certificate of Making Good, or final adjustment statement
- Conclusive effect (Cl. 1.9): Subject to Cl. 1.9.2 challenge windows (28 days for adjudication)
- Liquidated damages (Cl. 2.31–2.32): Require Non-Completion Certificate + Employer's advance notice + Pay Less Notice

KEY CASE LAW:
- Sutcliffe v Thackrah [1974]: CA must certify independently; liable for negligent over-certification
- Panamena v Leyland [1947]: Employer interference with certification makes certificate unreliable
- Merton v Leach [1985]: Failure to extend time properly sets time at large
- Triple Point v PTT [2021]: LDs apply only to termination date; now codified in Cl. 2.32.5

RESPONSE GUIDELINES:
- Always cite the specific clause number when referring to a contractual provision
- Identify the relevant deadlines and calculate them from the user's dates where possible
- Distinguish clearly between Relevant Events (time — Cl. 2.29) and Relevant Matters (money — Cl. 4.22)
- Flag common traps: missing Pay Less Notices, failing to issue Non-Completion Certificates, cash flow not being a valid basis for reducing certificates
- When drafting notices, include the minimum content required by the relevant clause
- Be direct and practical — the user is dealing with a real situation
- Keep responses concise but thorough — aim for 150-300 words unless the question requires more detail
- Use paragraph form, not bullet points, unless listing specific items or steps`;

// ─── TOOLS CONFIG ───────────────────────────────────────────────────
const TOOLS = [
  { id: "timeline", icon: "📅", title: "Payment Timeline", desc: "Calculate all dates for a payment cycle" },
  { id: "certificate", icon: "📋", title: "Certificate Calculator", desc: "Calculate the amount due in an Interim Certificate" },
  { id: "notices", icon: "📨", title: "Notice Drafter", desc: "Draft contractual payment notices" },
  { id: "advisor", icon: "💬", title: "Situation Advisor", desc: "Get advice on a payment situation" },
  { id: "final", icon: "🏁", title: "Final Account Tracker", desc: "Track the final account timetable" },
];

// ─── TIMELINE CALCULATOR ────────────────────────────────────────────
function TimelineTool() {
  const [ivd, setIvd] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    const ivdDate = parseDate(ivd);
    if (!ivdDate) return;
    const dueDate = addDays(ivdDate, 7);
    const certDeadline = addDays(dueDate, 5);
    const finalDate = addDays(dueDate, 14);
    const plnDeadline = subtractDays(finalDate, 5);
    const suspensionEarliest = addDays(finalDate, 7);

    setResult({ ivdDate, dueDate, certDeadline, plnDeadline, finalDate, suspensionEarliest });
  }

  const steps = result ? [
    { label: "Interim Valuation Date", date: result.ivdDate, note: "Contractor's Payment Application due by this date (Cl. 4.10.1)", color: A.dim },
    { label: "Due Date", date: result.dueDate, note: "IVD + 7 days (Cl. 4.8)", color: A.teal },
    { label: "Certificate Deadline", date: result.certDeadline, note: "Due date + 5 days — CA must issue Interim Certificate (Cl. 4.9.1)", color: A.accent },
    { label: "Pay Less Notice Deadline", date: result.plnDeadline, note: "Final date − 5 days — last day for Pay Less Notice (Cl. 4.11.5)", color: "#f87171" },
    { label: "Final Date for Payment", date: result.finalDate, note: "Due date + 14 days — Employer must pay (Cl. 4.11.1)", color: A.accent },
    { label: "Earliest Suspension", date: result.suspensionEarliest, note: "Final date + 7 days' notice — Contractor may suspend (Cl. 4.13)", color: "#f87171" },
  ] : [];

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, color: A.pri, marginBottom: 4 }}>📅 Payment Timeline Calculator</div>
      <div style={{ fontSize: 13, color: A.sec, marginBottom: 20 }}>Enter the Interim Valuation Date to calculate every deadline in the payment cycle.</div>
      <div style={{ display: "flex", gap: 12, alignItems: "end", marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 4 }}>Interim Valuation Date</label>
          <input type="date" value={ivd} onChange={e => setIvd(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14 }} />
        </div>
        <button onClick={calculate} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${P.teal}, ${P.tealLight})`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Calculate</button>
      </div>
      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              <div style={{ width: 40, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, border: `2px solid ${A.bg}`, zIndex: 1 }} />
                {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: A.bdr }} />}
              </div>
              <div style={{ flex: 1, padding: "0 0 16px", minHeight: 48 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: A.pri }}>{fmt(s.date)}</div>
                </div>
                <div style={{ fontSize: 12, color: A.sec, marginTop: 2 }}>{s.note}</div>
              </div>
            </div>
          ))}
          <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "12px 16px", marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171", marginBottom: 4 }}>⚠️ Late Certificate Fallback</div>
            <div style={{ fontSize: 13, color: A.sec, lineHeight: 1.6 }}>
              If no certificate is issued by {fmtShort(result.certDeadline)} and the Contractor made a Payment Application, that application automatically becomes a Payment Notice (Cl. 4.10.2.1) — the final date is NOT postponed. If no Payment Application was made, the Contractor may issue a Payment Notice (Cl. 4.10.2.2) and the final date IS postponed by the delay.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CERTIFICATE CALCULATOR ─────────────────────────────────────────
function CertificateTool() {
  const [vals, setVals] = useState({ work: "", materials: "", listedItems: "", lossExpense: "", fees: "", deductions: "", previousCerts: "", retPct: "3", postPC: false });
  const [result, setResult] = useState(null);
  const set = (k, v) => setVals(prev => ({ ...prev, [k]: v }));

  function calculate() {
    const work = parseFloat(vals.work) || 0;
    const materials = parseFloat(vals.materials) || 0;
    const listedItems = parseFloat(vals.listedItems) || 0;
    const lossExpense = parseFloat(vals.lossExpense) || 0;
    const fees = parseFloat(vals.fees) || 0;
    const deductions = parseFloat(vals.deductions) || 0;
    const previousCerts = parseFloat(vals.previousCerts) || 0;
    const retPct = parseFloat(vals.retPct) || 3;
    const effectiveRetPct = vals.postPC ? retPct / 2 : retPct;

    const subjectToRetention = work + materials + listedItems;
    const retentionAmount = subjectToRetention * (effectiveRetPct / 100);
    const notSubjectToRetention = lossExpense + fees;
    const grossValuation = subjectToRetention - retentionAmount + notSubjectToRetention - deductions;
    const amountDue = grossValuation - previousCerts;

    setResult({ subjectToRetention, retentionAmount, effectiveRetPct, notSubjectToRetention, deductions, grossValuation, previousCerts, amountDue });
  }

  const fields = [
    { key: "work", label: "Cumulative work properly executed", hint: "Cl. 4.14.1" },
    { key: "materials", label: "Site Materials", hint: "Cl. 4.14.1" },
    { key: "listedItems", label: "Listed Items (off-site)", hint: "Cl. 4.15" },
    { key: "lossExpense", label: "Loss & Expense ascertained", hint: "Cl. 4.14.2 — NOT subject to retention" },
    { key: "fees", label: "Statutory fees, insurance, other non-retention items", hint: "Cl. 4.14.2" },
    { key: "deductions", label: "Deductions (defective work, etc.)", hint: "Cl. 4.14.3" },
    { key: "previousCerts", label: "Total of previous Interim Certificates", hint: "" },
  ];

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, color: A.pri, marginBottom: 4 }}>📋 Certificate Calculator</div>
      <div style={{ fontSize: 13, color: A.sec, marginBottom: 20 }}>Enter cumulative valuation figures. The calculator applies the Gross Valuation rules (Cl. 4.14) and deducts retention.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {fields.map(f => (
          <label key={f.key} style={{ display: "block" }}>
            <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 3 }}>{f.label} {f.hint && <span style={{ color: A.dim }}>({f.hint})</span>}</span>
            <input type="number" value={vals[f.key]} onChange={e => set(f.key, e.target.value)} placeholder="£0"
              style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14 }} />
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: A.sec }}>
          Retention %
          <input type="number" value={vals.retPct} onChange={e => set("retPct", e.target.value)} step="0.5" min="0" max="10"
            style={{ width: 60, padding: "6px 8px", borderRadius: 6, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14, textAlign: "center" }} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: A.sec, cursor: "pointer" }}>
          <input type="checkbox" checked={vals.postPC} onChange={e => set("postPC", e.target.checked)} />
          Post-Practical Completion (half retention)
        </label>
        <button onClick={calculate} style={{ marginLeft: "auto", padding: "8px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${P.teal}, ${P.tealLight})`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Calculate</button>
      </div>

      {result && (
        <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: A.teal, marginBottom: 12 }}>Certificate Breakdown</div>
          {[
            { l: "Items subject to retention (work + materials + listed items)", v: result.subjectToRetention },
            { l: `Less: Retention at ${result.effectiveRetPct}%${vals.postPC ? " (post-PC half rate)" : ""}`, v: -result.retentionAmount, color: "#f87171" },
            { l: "Items NOT subject to retention (loss & expense, fees)", v: result.notSubjectToRetention },
            { l: "Less: Deductions", v: -result.deductions, color: "#f87171" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${A.bdr}` }}>
              <span style={{ fontSize: 13, color: A.sec }}>{r.l}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: r.color || A.pri }}>£{Math.abs(r.v).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${A.bdr}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: A.pri }}>Cumulative Gross Valuation</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: A.pri }}>£{result.grossValuation.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${A.bdr}` }}>
            <span style={{ fontSize: 13, color: A.sec }}>Less: Previous Interim Certificates</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#f87171" }}>£{result.previousCerts.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", marginTop: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: A.accent }}>Amount Due This Certificate</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: result.amountDue >= 0 ? A.teal : "#f87171" }}>£{result.amountDue.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── NOTICE DRAFTER ─────────────────────────────────────────────────
const NOTICE_TYPES = [
  { id: "payless", title: "Pay Less Notice", clause: "Cl. 4.11.5 / 4.12.1", desc: "When the Employer intends to pay less than the certified or notified sum" },
  { id: "payment", title: "Contractor's Payment Notice", clause: "Cl. 4.10.2.2", desc: "When no certificate has been issued and no Payment Application was made" },
  { id: "suspension", title: "Notice of Intention to Suspend", clause: "Cl. 4.13.1", desc: "When the Employer has failed to pay by the final date" },
  { id: "lad-warning", title: "Employer's LD Warning Notice", clause: "Cl. 2.32.1.2", desc: "Advance notice that the Employer may require payment of or deduct liquidated damages" },
];

function NoticeTool() {
  const [selected, setSelected] = useState(null);
  const [fields, setFields] = useState({});
  const set = (k, v) => setFields(prev => ({ ...prev, [k]: v }));

  const templates = {
    payless: { fields: [
      { k: "project", l: "Project name" }, { k: "certNo", l: "Certificate / Notice number" },
      { k: "certifiedSum", l: "Sum stated in certificate/notice (£)" }, { k: "sumConsidered", l: "Sum you consider due (£)" },
      { k: "basis", l: "Basis of calculation (e.g. defective work deducted, variation dispute)" }, { k: "finalDate", l: "Final date for payment", type: "date" },
    ], generate: (f) => {
      const plnDeadline = f.finalDate ? fmtShort(subtractDays(parseDate(f.finalDate), 5)) : "[5 days before final date]";
      return `PAY LESS NOTICE
Under Clause 4.11.5 and 4.12.1 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Reference: ${f.certNo || "[Certificate/Notice ref]"}

We refer to the Payment Certificate / Payment Notice in the sum of £${f.certifiedSum || "[amount]"}.

We hereby give notice under Clause 4.11.5 that we intend to pay less than the sum stated as due. The sum we consider to be due is:

£${f.sumConsidered || "[amount]"}

The basis on which this sum has been calculated is as follows:

${f.basis || "[State the basis of calculation — this is a mandatory requirement under Cl. 4.12.1. Valid bases include: valuation differences, defective work to be remedied, contractual set-offs, liquidated damages. A lack of funds is NOT a valid basis.]"}

This notice is given not later than 5 days before the final date for payment${f.finalDate ? ` (${fmtShort(parseDate(f.finalDate))})` : ""}.

Deadline for this notice: ${plnDeadline}`;
    }},
    payment: { fields: [
      { k: "project", l: "Project name" }, { k: "period", l: "Valuation period / IVD" },
      { k: "sumDue", l: "Sum Contractor considers due (£)" }, { k: "basisCalc", l: "Basis of calculation" },
    ], generate: (f) => `CONTRACTOR'S PAYMENT NOTICE
Under Clause 4.10.2.2 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Valuation period: ${f.period || "[Period / IVD]"}

No Payment Certificate has been issued in accordance with Clause 4.9.1 and no Payment Application was made under Clause 4.10.1.

We hereby give notice under Clause 4.10.2.2 that the sum we consider to have become due under Clauses 4.14 and 4.15 at the relevant due date is:

£${f.sumDue || "[amount]"}

The basis on which this sum has been calculated:

${f.basisCalc || "[Set out the calculation basis — work properly executed, materials on site, retention deducted, previous certificates deducted, etc.]"}

NOTE: Under Clause 4.11.4, the final date for payment is postponed by the number of days between when the certificate should have been issued and the date of this notice.` },
    suspension: { fields: [
      { k: "project", l: "Project name" }, { k: "sumUnpaid", l: "Unpaid sum (£)" },
      { k: "finalDate", l: "Final date for payment that was missed", type: "date" },
    ], generate: (f) => `NOTICE OF INTENTION TO SUSPEND PERFORMANCE
Under Clause 4.13.1 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}

We refer to the sum of £${f.sumUnpaid || "[amount]"} which was payable by the final date for payment${f.finalDate ? ` (${fmtShort(parseDate(f.finalDate))})` : ""} and which remains unpaid.

We hereby give notice under Clause 4.13.1 of our intention to suspend performance of our obligations under the Contract.

Grounds for suspension: The Employer has failed to pay the sum payable in accordance with Clause 4.11 by the final date for payment.

If payment in full (including any VAT properly chargeable) is not received within 7 days of this notice, we shall exercise our right to suspend performance of any or all of our obligations.

We reserve our rights to:
— recover reasonable costs and expenses incurred as a result of suspension (Cl. 4.13.2)
— claim an extension of time
— all other rights and remedies under the Contract and at law` },
    "lad-warning": { fields: [
      { k: "project", l: "Project name" }, { k: "completionDate", l: "Completion Date", type: "date" },
      { k: "ladRate", l: "LD rate (£ per week)" },
    ], generate: (f) => `EMPLOYER'S NOTICE — LIQUIDATED DAMAGES
Under Clause 2.32.1.2 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}

The Completion Date${f.completionDate ? ` (${fmtShort(parseDate(f.completionDate))})` : ""} has passed and a Non-Completion Certificate has been issued under Clause 2.31.

We hereby notify you under Clause 2.32.1.2 that the Employer may require payment of, or may withhold or deduct, liquidated damages at the rate stated in the Contract Particulars${f.ladRate ? ` (£${f.ladRate} per week)` : ""}.

IMPORTANT: This notice is a prerequisite to the Employer's right to deduct liquidated damages. In addition, where the Employer intends to withhold or deduct any amount, a Pay Less Notice must also be given under Clause 4.11.5 (SBC Guide, paragraph 68).` },
  };

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, color: A.pri, marginBottom: 4 }}>📨 Notice Drafter</div>
      <div style={{ fontSize: 13, color: A.sec, marginBottom: 20 }}>Select a notice type, enter your details, and get a draft based on the contractual requirements.</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {NOTICE_TYPES.map(n => (
          <button key={n.id} onClick={() => { setSelected(n.id); setFields({}); }}
            style={{ padding: "14px 16px", borderRadius: 10, border: `2px solid ${selected === n.id ? A.teal : A.bdr}`, background: selected === n.id ? "rgba(46,196,168,0.08)" : "rgba(0,0,0,0.1)", textAlign: "left", cursor: "pointer" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: selected === n.id ? A.teal : A.pri }}>{n.title}</div>
            <div style={{ fontSize: 11, color: A.dim, marginTop: 2 }}>{n.clause}</div>
            <div style={{ fontSize: 12, color: A.sec, marginTop: 4 }}>{n.desc}</div>
          </button>
        ))}
      </div>

      {selected && templates[selected] && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {templates[selected].fields.map(f => (
              <label key={f.k} style={{ display: "block" }}>
                <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 3 }}>{f.l}</span>
                <input type={f.type || "text"} value={fields[f.k] || ""} onChange={e => set(f.k, e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14 }} />
              </label>
            ))}
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "20px 24px", fontFamily: "'Courier New', monospace", fontSize: 13, color: A.pri, lineHeight: 1.8, whiteSpace: "pre-wrap", border: `1px solid ${A.bdr}` }}>
            {templates[selected].generate(fields)}
          </div>
          <div style={{ fontSize: 12, color: A.dim, marginTop: 8, fontStyle: "italic" }}>
            This is a template based on the contractual requirements. Review and adapt it to your specific circumstances before issuing. This is not legal advice.
          </div>
        </>
      )}
    </div>
  );
}

// ─── FINAL ACCOUNT TRACKER ──────────────────────────────────────────
function FinalAccountTool() {
  const [pcDate, setPcDate] = useState("");
  const [rectMonths, setRectMonths] = useState("6");
  const [mgDate, setMgDate] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    const pc = parseDate(pcDate);
    if (!pc) return;
    const rectPeriodMonths = parseInt(rectMonths) || 6;
    const contractorDocDeadline = new Date(pc); contractorDocDeadline.setMonth(contractorDocDeadline.getMonth() + 6);
    const rectEnd = new Date(pc); rectEnd.setMonth(rectEnd.getMonth() + rectPeriodMonths);
    const mg = parseDate(mgDate);

    // QS has 3 months after receiving contractor's docs
    const qsDeadline = new Date(contractorDocDeadline); qsDeadline.setMonth(qsDeadline.getMonth() + 3);

    // Final cert trigger: latest of rectEnd, mg, qsDeadline
    const triggers = [rectEnd, qsDeadline];
    if (mg) triggers.push(mg);
    const latestTrigger = new Date(Math.max(...triggers.map(d => d.getTime())));
    const finalCertDeadline = new Date(latestTrigger); finalCertDeadline.setMonth(finalCertDeadline.getMonth() + 2);
    const adjudicationWindow = addDays(finalCertDeadline, 28);

    setResult({ pc, contractorDocDeadline, rectEnd, mg, qsDeadline, latestTrigger, finalCertDeadline, adjudicationWindow });
  }

  return (
    <div>
      <div style={{ fontSize: 18, fontWeight: 700, color: A.pri, marginBottom: 4 }}>🏁 Final Account Tracker</div>
      <div style={{ fontSize: 13, color: A.sec, marginBottom: 20 }}>Enter the Practical Completion date to track all deadlines through to the Final Certificate.</div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <label style={{ flex: 1, minWidth: 180 }}>
          <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 3 }}>Practical Completion Date</span>
          <input type="date" value={pcDate} onChange={e => setPcDate(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14 }} />
        </label>
        <label style={{ width: 120 }}>
          <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 3 }}>Rectification (months)</span>
          <input type="number" value={rectMonths} onChange={e => setRectMonths(e.target.value)} min="1" max="24"
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14, textAlign: "center" }} />
        </label>
        <label style={{ flex: 1, minWidth: 180 }}>
          <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 3 }}>Certificate of Making Good (if known)</span>
          <input type="date" value={mgDate} onChange={e => setMgDate(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14 }} />
        </label>
        <button onClick={calculate} style={{ alignSelf: "end", padding: "8px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${P.teal}, ${P.tealLight})`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Calculate</button>
      </div>

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Practical Completion", date: result.pc, note: "Triggers: Rectification Period begins, half retention released, LD liability ends", color: A.teal },
            { label: "Contractor's Documents Deadline", date: result.contractorDocDeadline, note: "PC + 6 months — Contractor must provide final account documents (Cl. 4.25.1)", color: A.accent },
            { label: "End of Rectification Period", date: result.rectEnd, note: `PC + ${rectMonths} months — Schedule of Defects due within 14 days (Cl. 2.38)`, color: A.dim },
            ...(result.mg ? [{ label: "Certificate of Making Good", date: result.mg, note: "Triggers release of remaining retention (Cl. 2.39 / 4.19)", color: A.teal }] : []),
            { label: "QS Adjustment Deadline", date: result.qsDeadline, note: "Contractor docs + 3 months — QS prepares final statement (Cl. 4.25.2)", color: A.accent },
            { label: "Latest Trigger for Final Certificate", date: result.latestTrigger, note: "Whichever occurs last of the above (Cl. 4.26.1)", color: "#f87171" },
            { label: "Final Certificate Deadline", date: result.finalCertDeadline, note: "Latest trigger + 2 months — CA must issue Final Certificate (Cl. 4.26.1)", color: A.accent },
            { label: "Adjudication Challenge Window Closes", date: result.adjudicationWindow, note: "Final Certificate + 28 days — after this, conclusive effect applies (Cl. 1.9.2)", color: "#f87171" },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
              <div style={{ width: 40, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, border: `2px solid ${A.bg}`, zIndex: 1 }} />
                {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: A.bdr }} />}
              </div>
              <div style={{ flex: 1, padding: "0 0 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: A.pri }}>{fmt(s.date)}</div>
                </div>
                <div style={{ fontSize: 12, color: A.sec, marginTop: 2 }}>{s.note}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AI SITUATION ADVISOR ───────────────────────────────────────────
function AdvisorTool() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages, loading]);

  const QUICK_PROMPTS = [
    "The Employer hasn't paid by the final date. What are the Contractor's options?",
    "The Contractor is claiming loss and expense for bad weather — is this valid?",
    "I forgot to issue the Interim Certificate on time. What happens now?",
    "Can the Employer reduce a certificate because of cash flow problems?",
    "How do I handle a Pay Less Notice when the amount is zero?",
    "The Contractor wants retention released but I haven't issued the Certificate of Making Good yet.",
  ];

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const aiText = data.content?.map(b => b.type === "text" ? b.text : "").filter(Boolean).join("\n") || "I wasn't able to generate a response. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "There was an error connecting to the AI service. Please check your connection and try again." }]);
    }
    setLoading(false);
  }, [messages, loading]);

  function handleKeyDown(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: 500 }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: A.pri, marginBottom: 4 }}>💬 Situation Advisor</div>
      <div style={{ fontSize: 13, color: A.sec, marginBottom: 16 }}>Describe your payment situation and get advice grounded in the SBC/Q 2024 contract provisions and case law.</div>

      {/* Quick prompts - shown when no messages */}
      {messages.length === 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: A.dim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Common situations</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.1)", color: A.sec, fontSize: 12, cursor: "pointer", textAlign: "left", lineHeight: 1.4 }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "14px 18px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.role === "user" ? A.userBg : A.aiBg, border: `1px solid ${A.bdr}` }}>
            {m.role === "assistant" && <div style={{ fontSize: 11, fontWeight: 700, color: A.teal, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Advisor</div>}
            <div style={{ fontSize: 14, lineHeight: 1.75, color: A.pri, whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", padding: "14px 18px", borderRadius: "16px 16px 16px 4px", background: A.aiBg, border: `1px solid ${A.bdr}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A.teal, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Payment Advisor</div>
            <div style={{ fontSize: 14, color: A.dim }}>Reviewing the contract provisions…</div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Describe your situation — e.g. 'The certificate was issued 3 days late and the Contractor is demanding interest...'"
          rows={2}
          style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14, lineHeight: 1.5, resize: "none", fontFamily: "inherit" }} />
        <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
          style={{ padding: "12px 20px", borderRadius: 12, border: "none", background: loading || !input.trim() ? A.dim : `linear-gradient(135deg, ${P.teal}, ${P.tealLight})`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: loading || !input.trim() ? "default" : "pointer", opacity: loading || !input.trim() ? 0.5 : 1, alignSelf: "end" }}>
          Send
        </button>
      </div>
      <div style={{ fontSize: 11, color: A.dim, marginTop: 6, textAlign: "center" }}>
        This advisor provides guidance based on the SBC/Q 2024 contract. It is not legal advice. Always consult a qualified professional for specific situations.
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
export default function PaymentAssistant() {
  const [activeTool, setActiveTool] = useState("timeline");

  const toolComponent = {
    timeline: <TimelineTool />,
    certificate: <CertificateTool />,
    notices: <NoticeTool />,
    advisor: <AdvisorTool />,
    final: <FinalAccountTool />,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", background: A.bg, overflow: "hidden" }}>
        {/* ─── SIDEBAR ─── */}
        <nav style={{ width: 240, minHeight: "100%", background: "#091727", padding: "24px 0", display: "flex", flexDirection: "column", flexShrink: 0, borderRight: `1px solid ${A.bdr}` }}>
          <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${A.bdr}` }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: A.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Module 6</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: A.pri, lineHeight: 1.3 }}>Payment Assistant</div>
            <div style={{ fontSize: 11, color: A.dim, marginTop: 6 }}>SBC/Q 2024 — Your Project</div>
          </div>
          <div style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
            {TOOLS.map((t) => {
              const active = activeTool === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTool(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 20px", background: active ? "rgba(46,196,168,0.08)" : "transparent", border: "none", borderLeft: active ? `3px solid ${A.teal}` : "3px solid transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? A.pri : A.sec }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: A.dim, marginTop: 1 }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ padding: "12px 20px", borderTop: `1px solid ${A.bdr}`, fontSize: 11, color: A.dim, lineHeight: 1.5 }}>
            Calculations are performed locally. The Situation Advisor uses AI and should be verified independently.
          </div>
        </nav>

        {/* ─── MAIN PANEL ─── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 40px 60px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {toolComponent[activeTool]}
          </div>
        </main>
      </div>
    </>
  );
}
