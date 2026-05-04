import { useState } from "react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════════
   Simulator 6: Payment Inbox
   Extracted from Module 6 — standalone route
   ═══════════════════════════════════════════════════════════════════════ */

const S = { bg: "#0c1b2e", card: "#132840", accent: "#e8a838", accentDim: "#c48a24", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", ok: "#34d399", okBg: "rgba(52,211,153,0.12)", bad: "#f87171", badBg: "rgba(248,113,113,0.1)", bdr: "#1e3a5f" };

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
    <div style={{ background: S.bg, borderRadius: 16, padding: "28px 24px", minHeight: "80vh" }}>
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

export default function Sim6Payment() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      <Link to="/" style={{ position: "fixed", top: 16, right: 20, zIndex: 999, padding: "7px 16px", borderRadius: 8, background: "rgba(15,42,68,0.85)", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5, backdropFilter: "blur(8px)" }}>← All Modules</Link>
      <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", padding: "32px 24px 60px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Simulator />
        </div>
      </div>
    </>
  );
}
