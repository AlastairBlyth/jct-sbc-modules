import { useState } from "react";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════════
   Simulator 3: Contract Administrator's Inbox
   Extracted from Module 3 — standalone route
   ═══════════════════════════════════════════════════════════════════════ */

const S = { bg: "#0c1b2e", card: "#132840", accent: "#e8a838", accentDim: "#c48a24", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", ok: "#34d399", okBg: "rgba(52,211,153,0.12)", bad: "#f87171", badBg: "rgba(248,113,113,0.1)", bdr: "#1e3a5f" };

// ─── SIMULATOR: EMAIL INBOX ─────────────────────────────────────────
const EMAILS = [
  { id: 1, month: "Week 1", from: "James Reid (Site Manager)", subject: "Oral instruction on site — facing brick change", role: "contractor",
    body: `Hi,\n\nYou visited site this morning and told our foreman to change the facing brick on the east elevation from Ibstock Leicester Red to Wienerberger Terca Campagne. You said something about the Employer not liking the colour.\n\nWe haven't received anything in writing. Our foreman is asking whether to proceed. This will affect our programme and our brick order.\n\nPlease confirm.\n\nJames Reid\nSite Manager, Hartwell Construction`,
    type: "choice",
    question: "What should you do?",
    options: [
      { label: "Tell the Contractor to proceed — oral instructions are binding", feedback: "Oral instructions are NOT immediately effective under Clause 3.12. They only take effect once confirmed in writing through the prescribed mechanism. Proceeding without written confirmation exposes both parties to uncertainty.", points: 1 },
      { label: "Issue a written instruction confirming the brick change as a Variation under Clause 3.14. This formalises the oral instruction under Clause 3.12.2 and gives it effect from the date of your written confirmation.", feedback: "Correct! Under Clause 3.12.2, if the CA confirms the oral instruction in writing within 7 days, it takes effect from the date of the CA's confirmation. This is the cleanest route — it removes ambiguity and gives the Contractor a proper written instruction to act on. The brick change is a Variation (change in specification), so it should be issued under Clause 3.14 and valued under the Valuation Rules.", points: 10, correct: true },
      { label: "Withdraw the instruction — you shouldn't have given it orally", feedback: "While instructions should ideally be in writing from the outset, Clause 3.12 expressly contemplates oral instructions and provides a mechanism for confirming them. There is no need to withdraw — simply confirm it in writing.", points: 3 },
    ], points: 10 },

  { id: 2, month: "Week 3", from: "Sarah Webb (Employer)", subject: "RE: Interim Certificate 4 — please reduce", role: "employer",
    body: `Hi,\n\nI've seen the Month 4 Interim Certificate for £285,000. Our cash flow is very tight this quarter following the board's decision to bring forward the IT upgrade.\n\nCan you reissue the certificate at £220,000? We'll make up the difference over the next two months. The Contractor won't mind — they have other projects running.\n\nRegards,\nSarah Webb\nFinance Director, Greenfield Academy Trust`,
    type: "choice",
    question: "How do you respond?",
    options: [
      { label: "Agree to reissue at £220,000 — the Employer is the client and their cash flow needs are a legitimate concern", feedback: "Never. The CA must certify the sum genuinely considered due, regardless of the Employer's financial position. Under-certifying to manage the Employer's cash flow is a breach of the CA's independent duty. Per Panamena [1947], if the Employer interferes with the certifying function, the certificate becomes unreliable and vulnerable to challenge. The Contractor could refer the matter to adjudication and obtain a 'smash and grab' award for the full certified sum.", points: 0 },
      { label: "Refuse. Explain that you must certify the sum genuinely considered due (£285,000) and cannot reduce it for cash flow reasons. The Employer's remedy is to manage their own finances — not to manipulate the certification process.", feedback: "Correct! This is the Panamena principle in action. The CA is an independent certifier when issuing payment certificates. The sum certified must be the sum the CA genuinely considers due based on the QS's valuation. The Employer's cash flow difficulties are not the CA's concern in the certification process. If the Employer wants to pay less, the proper mechanism is a Pay Less Notice under Clause 4.11.5 — but even that must be contractually grounded, not based on cash flow.", points: 10, correct: true },
      { label: "Issue a Pay Less Notice on the Employer's behalf for £220,000", feedback: "Two problems. First, the Pay Less Notice is issued by the Employer (or Contractor), not the CA. Second, a Pay Less Notice must specify a sum considered due and the basis of its calculation — cash flow difficulties are not a valid contractual basis.", points: 2 },
    ], points: 10 },

  { id: 3, month: "Week 5", from: "Tom Harris (Hartwell)", subject: "Delay notification — structural drawings 3 weeks late", role: "contractor",
    body: `Hi,\n\nWe are writing under Clause 2.27 to notify you that progress of the Works is being delayed by the late issue of the steel frame structural drawings for the first-floor extension.\n\nThese drawings were due on 15 February per the Information Release Schedule. They were not issued until 8 March — a delay of 3 weeks.\n\nWe consider this to be a Relevant Event under Clause 2.29 and will be submitting full particulars shortly.\n\nRegards,\nTom Harris\nCommercial Director, Hartwell Construction`,
    type: "choice",
    question: "What is the correct response?",
    options: [
      { label: "Reject the notification — the Contractor should have chased the drawings earlier", feedback: "Wrong. The obligation to supply information in accordance with the Information Release Schedule falls on the CA, not the Contractor. Late issue of drawings is a classic Relevant Event under Clause 2.29.7 (impediment, prevention or default by the Employer or Employer's Persons). The Contractor's duty under Clause 2.27 is to notify — which they have done properly.", points: 0 },
      { label: "Acknowledge the notification. Request full particulars under Clause 2.27.2. Once received, you have 8 weeks to decide whether to grant an extension of time under Clause 2.28.", feedback: "Correct! The Contractor has properly notified under Clause 2.27.1. You should acknowledge and request the full particulars (expected effects of the delay and any material changes). Once you receive these, the 8-week decision period under Clause 2.28.2 begins. Late drawings fall under Relevant Event 2.29.7 — and critically, it is also a Relevant Matter under Clause 4.22.5, so the Contractor may also be entitled to loss and expense. Failing to deal with this properly risks time being set at large (Merton v Leach).", points: 10, correct: true },
      { label: "Immediately grant a 3-week extension — the delay is clearly the CA's fault", feedback: "While the delay may well justify a 3-week extension, the CA must follow the contractual procedure: wait for full particulars, consider the actual effect on the Completion Date (not just the duration of the delay itself), and make a fair and reasonable decision within 8 weeks. Granting an extension without proper assessment — even a generous one — is not good contract administration.", points: 4 },
    ], points: 10 },

  { id: 4, month: "Week 8", from: "James Reid (Site Manager)", subject: "URGENT — contaminated material found in excavation", role: "contractor",
    body: `Hi,\n\nDuring excavation for the foundations this morning, we discovered what appears to be asbestos-containing material approximately 1.5m below ground level. We have:\n\n1. Stopped work in the affected area immediately\n2. Cordoned off the area\n3. Notified the HSE\n\nWe need your instructions urgently. The excavation crew is standing idle and we have a concrete pour scheduled for Thursday.\n\nJames Reid\nSite Manager, Hartwell Construction`,
    type: "choice",
    question: "What should you do?",
    options: [
      { label: "Tell the Contractor to remove the material themselves and get on with the pour", feedback: "Dangerous and wrong. Asbestos removal requires licensed specialists. Under Clause 3.22.3, the Contractor's duty is to cease work where continuing would endanger health and safety and to report the discovery. The CA must issue formal instructions under Clause 3.22.4. This is a statutory as well as contractual requirement.", points: 0 },
      { label: "Issue instructions under Clause 3.22.4 requiring the Contractor to permit investigation and removal by a licensed asbestos specialist. Confirm the Contractor was right to cease work. Note that this is a Relevant Event (Cl. 2.29.4) for extension of time and a Relevant Matter (Cl. 4.22.3) for loss and expense.", feedback: "Correct! This is the new 2024 contamination procedure in action. The Contractor correctly followed Clause 3.22.3 by ceasing work and reporting. You must now issue instructions under Clause 3.22.4 — which may include permitting a third party to investigate and remove the material. The delay is a Relevant Event giving time and a Relevant Matter giving money. The Contractor is entitled to be kept whole for the disruption caused by a ground condition that was not their responsibility.", points: 10, correct: true },
      { label: "Wait for the Environmental Consultant's report before issuing any instructions", feedback: "While getting expert advice is sensible, you should not delay issuing instructions. The Contractor's crew is standing idle and the contract requires you to issue instructions 'with respect to' the discovered material. You can issue an initial instruction (confirming the stop, requiring the area to remain cordoned off, and commissioning specialist investigation) and then issue further instructions once the investigation results are known.", points: 4 },
    ], points: 10 },

  { id: 5, month: "Week 10", from: "Tom Harris (Hartwell)", subject: "Which clause empowers your instruction?", role: "contractor",
    body: `Hi,\n\nWe received your instruction yesterday requiring us to change the sequence of works so that the roofing is completed before the internal partitions on the first floor.\n\nUnder Clause 3.13, please confirm which provision of the Conditions empowers this instruction.\n\nWe have concerns that this change will significantly disrupt our programme and increase our prelims costs.\n\nRegards,\nTom Harris`,
    type: "choice",
    question: "How do you respond?",
    options: [
      { label: "Refuse to specify the clause — the Contractor must simply comply", feedback: "Wrong. Clause 3.13 gives the Contractor the right to request the empowering clause, and the CA must comply 'forthwith'. Refusing is itself a breach of the contract.", points: 0 },
      { label: "Confirm that the instruction is issued under Clause 3.14 (Variations) as it falls within Clause 5.1.2 (imposing obligations or restrictions on the order of working). Note that the Contractor has a right of reasonable objection under Clause 3.10.1 for this type of variation.", feedback: "Correct! A change to the order of working is a Variation under Clause 5.1.2. You must identify the empowering clause forthwith (Clause 3.13). Crucially, Clause 3.10.1 gives the Contractor a right of reasonable written objection to variations affecting access, working space, hours, or order of working — so you should also acknowledge this right. If the Contractor objects and you still consider the instruction necessary, you need to weigh whether the objection is 'reasonable' before pressing ahead.", points: 10, correct: true },
      { label: "Withdraw the instruction since the Contractor has challenged it", feedback: "A Clause 3.13 request is not a challenge — it is a legitimate right to know the contractual basis of an instruction. Withdrawing the instruction simply because it was questioned would be poor contract administration. You should respond by identifying the clause.", points: 2 },
    ], points: 10 },

  { id: 6, month: "Week 14", from: "Maria Chen (Quantity Surveyor)", subject: "Practical Completion inspection — your view needed", role: "qs",
    body: `Hi,\n\nI've completed the pre-PC inspection with the Site Manager. The key findings:\n\n• All structural and M&E work is complete and commissioned\n• The building is wind and watertight\n• All fire safety systems tested and operational\n• Minor snagging: 23 items (paint touch-ups, minor plaster cracks, one stiff door handle, cleaning)\n• Outstanding issue: the car park surface has two areas of ponding after rain — approx 15 sqm total\n\nThe Contractor says they are ready for Practical Completion. The Employer is keen to take possession for the new term.\n\nWhat is your view?\n\nMaria`,
    type: "choice",
    question: "Do you issue the Practical Completion Certificate?",
    options: [
      { label: "No — wait until all 23 snagging items and the car park ponding are resolved", feedback: "Too cautious. Following H W Nevill (Sunblest) v William Press [1981], practical completion does not require literal perfection. The 23 snagging items are minor (paint, plaster, a door handle, cleaning) — exactly the kind of 'trifling' defects that do not prevent PC. The car park ponding is a closer call, but two small areas totalling 15 sqm, while not ideal, do not prevent the building being used for its intended purpose.", points: 2 },
      { label: "Yes — issue the Practical Completion Certificate. The building is complete for all practical purposes. The 23 snagging items are minor defects that can be addressed in the Rectification Period. The car park ponding, while a defect, does not prevent the building being used for its intended purpose.", feedback: "Correct! Applying the Nevill (Sunblest) test: the works are complete for all practical purposes. The building is wind and watertight, structurally complete, with all M&E and fire systems operational. The 23 snagging items are genuinely 'trifling' (Lord Salmon's word in Westminster v Jarvis). The car park ponding should be included on a snagging list for rectification, but two small areas do not prevent the building being occupied and used as a school. Issue the certificate, attach a Schedule of Defects, and the Rectification Period begins.", points: 10, correct: true },
      { label: "Issue the certificate but only after the car park ponding is fixed", feedback: "The car park ponding is a defect, but it does not prevent the building being used for its intended purpose (it's a school — the car park can still be used). Delaying PC for this issue would unreasonably withhold the certificate, keep the Contractor liable for liquidated damages, and delay the release of retention. The ponding should go on the snagging list for the Rectification Period.", points: 5 },
    ], points: 10 },

  { id: 7, month: "Week 16", from: "David Chen (Clerk of Works)", subject: "Direction given to Contractor on site", role: "cow",
    body: `Hi,\n\nI was on site today and noticed the bricklayer using mortar that looked too wet for the specification. I directed them to stop and remix the mortar to comply with the mix design in the specification.\n\nThe Site Manager has asked whether this direction is binding.\n\nPlease confirm.\n\nDavid Chen\nClerk of Works`,
    type: "choice",
    question: "What is the contractual position?",
    options: [
      { label: "The Clerk of Works' direction is immediately binding — it relates to quality control", feedback: "Wrong. Under Clause 3.4, a Clerk of Works direction is NOT immediately binding. It only takes effect if the CA confirms it with an instruction within 2 Business Days.", points: 1 },
      { label: "The direction has no effect unless you, as CA, confirm it by issuing an instruction within 2 Business Days under Clause 3.4. You should confirm the direction as it relates to compliance with the specification.", feedback: "Correct! Clause 3.4 provides that the Clerk of Works may give directions, but they only take effect as CA instructions if the CA issues a confirmatory instruction within 2 Business Days. The direction relates to specification compliance (mortar mix), so you should confirm it — the work must comply with Clause 2.1.1 (proper and workmanlike manner in accordance with the Contract Documents). If you fail to confirm within 2 Business Days, the direction lapses.", points: 10, correct: true },
      { label: "Ignore it — the Clerk of Works has no authority under the contract", feedback: "The Clerk of Works does have a role under Clause 3.4, but their directions are not self-executing. They require your confirmation within 2 Business Days. You should not ignore a legitimate quality concern raised by your Clerk of Works.", points: 0 },
    ], points: 10 },

  { id: 8, month: "Week 20", from: "Sarah Webb (Employer)", subject: "Contractor is 4 weeks late — I want liquidated damages NOW", role: "employer",
    body: `Hi,\n\nThe Completion Date was 1 September and it is now 29 September. The Contractor is clearly late.\n\nI want to start deducting liquidated damages immediately from the next payment. The rate in the Contract Particulars is £5,000 per week.\n\nPlease confirm you will action this.\n\nSarah Webb\nChair of Governors, Greenfield Academy Trust`,
    type: "choice",
    question: "What must happen before the Employer can deduct liquidated damages?",
    options: [
      { label: "Simply deduct £20,000 (4 weeks × £5,000) from the next certificate — the Completion Date has passed", feedback: "Missing critical steps. The Employer cannot deduct liquidated damages until two procedural requirements are met. Without them, any deduction is unlawful.", points: 1 },
      { label: "Three steps are required: (1) You must issue a Non-Completion Certificate under Clause 2.31 certifying that the Contractor has failed to complete by the Completion Date. (2) The Employer must have given advance notice under Clause 2.32.1.2 that it may require payment or withhold/deduct liquidated damages. (3) The Employer must issue a Pay Less Notice under Clause 4.11.5 specifying the deduction.", feedback: "Correct! The contractual machinery has three prerequisites. First, the CA must issue a Non-Completion Certificate (Clause 2.31) — this is a duty, not a discretion, when the Completion Date has passed without practical completion. Second, the Employer must have notified the Contractor that it may require payment of or deduct liquidated damages (Clause 2.32.1.2). Third, any actual withholding or deduction must also comply with the Pay Less Notice requirements (as the SBC Guide paragraph 68 confirms). Skipping any step exposes the Employer to a successful adjudication challenge.", points: 10, correct: true },
      { label: "You just need to issue a Non-Completion Certificate — the Employer can then deduct immediately", feedback: "The Non-Completion Certificate is necessary but not sufficient. The Employer must also have given advance warning under Clause 2.32.1.2 AND must issue a Pay Less Notice for any actual deduction. The SBC Guide (paragraph 68) emphasises that both the Clause 2.32 notice and a Pay Less Notice are required.", points: 4 },
    ], points: 10 },
];

// ─── SIMULATOR COMPONENT ────────────────────────────────────────────
function SimEmail({ email, state, onChoice }) {
  const answered = state?.answered;
  const roleColors = { contractor: "#3b82f6", employer: "#e8a838", qs: "#2ec4a8", cow: "#a78bfa" };
  const roleLabels = { contractor: "Contractor", employer: "Employer", qs: "Quantity Surveyor", cow: "Clerk of Works" };
  return (
    <div style={{ background: S.card, border: `1px solid ${answered ? (state.correct ? S.ok : S.bad) : S.bdr}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${S.bdr}`, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: roleColors[email.role] || S.teal, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: S.pri }}>{email.from}</div>
          <div style={{ fontSize: 12, color: S.sec }}>{email.subject}</div>
        </div>
        <div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: 1 }}>{email.month}</div>
        {answered && <div style={{ fontSize: 14, fontWeight: 700, color: state.correct ? S.ok : S.bad }}>{state.points}/10</div>}
      </div>
      <div style={{ padding: "18px 20px" }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: S.pri, whiteSpace: "pre-line" }}>{email.body}</p>
      </div>
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: S.teal, marginBottom: 10 }}>{email.question}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {email.options.map((o, i) => {
            let bg = "rgba(0,0,0,0.15)", bd = S.bdr, tc = S.pri;
            if (answered) { if (o.correct) { bg = S.okBg; bd = S.ok; tc = S.ok; } else if (i === state.selected) { bg = S.badBg; bd = S.bad; tc = S.bad; } else { tc = S.dim; } }
            return <button key={i} onClick={() => !answered && onChoice(email.id, i)} style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${bd}`, background: bg, textAlign: "left", cursor: answered ? "default" : "pointer", fontSize: 14, color: tc, fontWeight: answered && o.correct ? 700 : 400, lineHeight: 1.5 }}>{o.label}</button>;
          })}
        </div>
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

  function handleChoice(emailId, optIdx) {
    const email = EMAILS.find(e => e.id === emailId);
    const opt = email.options[optIdx];
    setEmailStates(prev => ({ ...prev, [emailId]: { answered: true, selected: optIdx, correct: !!opt.correct, points: opt.points, message: opt.feedback } }));
  }

  return (
    <div style={{ background: S.bg, borderRadius: 16, padding: "28px 24px", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: S.pri, fontFamily: "'Playfair Display', Georgia, serif" }}>📬 Contract Administrator's Inbox</div>
          <div style={{ fontSize: 13, color: S.sec, marginTop: 4 }}>Greenfield Academy — £4.2M School Extension | You are the Architect/CA</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: 1 }}>Handled</div><div style={{ fontSize: 15, fontWeight: 700, color: S.accent }}>{answered}/8</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: S.dim, textTransform: "uppercase", letterSpacing: 1 }}>Score</div><div style={{ fontSize: 15, fontWeight: 700, color: S.teal }}>{totalPts}/80</div></div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {EMAILS.map(e => <SimEmail key={e.id} email={e} state={emailStates[e.id]} onChoice={handleChoice} />)}
      </div>
      {answered === 8 && (
        <div style={{ background: S.card, border: `1px solid ${S.bdr}`, borderRadius: 14, padding: "36px 28px", textAlign: "center", marginTop: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>{totalPts >= 72 ? "🏆" : totalPts >= 56 ? "🎓" : "📚"}</div>
          <div style={{ fontSize: 38, fontWeight: 800, color: S.accent }}>{totalPts}/80</div>
          <div style={{ fontSize: 15, color: S.sec, marginTop: 10, lineHeight: 1.7 }}>
            {totalPts >= 72 ? "Outstanding — you handled every situation like a seasoned Contract Administrator." : totalPts >= 56 ? "Strong performance. Review the emails you got wrong and revisit the relevant case law." : "Review the learning module — particularly the sections on independence and certification — and try again."}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sim3ContractAdministrator() {
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
