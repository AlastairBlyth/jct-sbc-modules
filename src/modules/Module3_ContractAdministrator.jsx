import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   JCT SBC/Q 2024 — Module 3: The Contract Administrator
   Learning Module + "A Month in the Life" Simulator

   LEARNING MODULE: The CA's dual role, powers, duties, independence,
   certification, and key case law. Interactive exercises throughout.

   SIMULATOR: Email-inbox roleplay. You are the Architect/Contract
   Administrator on a live project — respond to instructions requests,
   certification pressures, delay notifications, and site discoveries.
   ═══════════════════════════════════════════════════════════════════════ */

// ─── PALETTE ────────────────────────────────────────────────────────
function BackLink() { return <Link to="/" style={{ position: "fixed", top: 16, right: 20, zIndex: 999, padding: "7px 16px", borderRadius: 8, background: "rgba(15,42,68,0.85)", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5, backdropFilter: "blur(8px)" }}>← All Modules</Link>; }
const P = { navy: "#0f2a44", navyLight: "#1a3d5c", teal: "#1a8a7d", tealLight: "#2bb5a4", tealPale: "#e8f6f4", gold: "#d4a843", goldPale: "#fdf6e3", cream: "#faf8f5", white: "#ffffff", text: "#1e2a3a", textMid: "#4a5c6e", textLight: "#7a8c9e", border: "#dde3ea", correct: "#22855b", correctBg: "#e8f5ef", wrong: "#c0392b", wrongBg: "#fdeaea", shadow: "0 2px 16px rgba(15,42,68,0.07)" };
const S = { bg: "#0c1b2e", card: "#132840", accent: "#e8a838", accentDim: "#c48a24", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", ok: "#34d399", okBg: "rgba(52,211,153,0.12)", bad: "#f87171", badBg: "rgba(248,113,113,0.1)", bdr: "#1e3a5f" };

// ─── SECTIONS ───────────────────────────────────────────────────────
const SECTIONS = [
  { id: "overview", title: "Overview", sub: "Module 3 at a Glance" },
  { id: "dual-role", title: "The Dual Role", sub: "Appointment & Independence" },
  { id: "instructions", title: "Instructions", sub: "Clauses 3.10–3.22" },
  { id: "certification", title: "Certification", sub: "Certificates & Time Limits" },
  { id: "eot-loss", title: "EOT & Loss/Expense", sub: "Clauses 2.26–2.29 & 4.20–4.24" },
  { id: "case-law", title: "Key Case Law", sub: "Principles from the Courts" },
];

// ─── SHARED UI ──────────────────────────────────────────────────────
function Bar({ v, max }) { return <div style={{ width: "100%", height: 4, background: P.border, borderRadius: 2 }}><div style={{ width: `${(v / max) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${P.teal}, ${P.tealLight})`, borderRadius: 2, transition: "width 0.4s" }} /></div>; }
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
function SortExercise({ title, instruction, items, correctOrder }) {
  const [order, setOrder] = useState(() => [...items].sort(() => Math.random() - 0.5));
  const [dragIdx, setDragIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  function handleDragOver(e, i) { e.preventDefault(); if (dragIdx === null || dragIdx === i) return; const n = [...order]; const it = n.splice(dragIdx, 1)[0]; n.splice(i, 0, it); setOrder(n); setDragIdx(i); }
  function check() { setCorrect(order.every((item, i) => item === correctOrder[i])); setChecked(true); }
  function reset() { setOrder([...items].sort(() => Math.random() - 0.5)); setChecked(false); setCorrect(false); }
  return (
    <Card style={{ margin: "18px 0", border: checked ? `2px solid ${correct ? P.correct : P.wrong}` : `1px solid ${P.border}` }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: P.navy, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: P.textMid, marginBottom: 14 }}>{instruction}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {order.map((item, i) => (
          <div key={item} draggable onDragStart={() => setDragIdx(i)} onDragOver={(e) => handleDragOver(e, i)} onDragEnd={() => setDragIdx(null)}
            style={{ padding: "12px 16px", borderRadius: 8, background: checked ? (item === correctOrder[i] ? P.correctBg : P.wrongBg) : (dragIdx === i ? P.tealPale : "#f8f9fb"), border: `1px solid ${checked ? (item === correctOrder[i] ? P.correct : P.wrong) : P.border}`, cursor: checked ? "default" : "grab", display: "flex", alignItems: "center", gap: 12, userSelect: "none" }}>
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

// ─── INTERACTIVE: PREDICT & REVEAL ──────────────────────────────────
function PredictReveal({ question, options, correctIdx, explanation }) {
  const [sel, setSel] = useState(null);
  const [revealed, setRevealed] = useState(false);
  return (
    <Card style={{ margin: "18px 0" }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: P.navy, marginBottom: 12, lineHeight: 1.5 }}>{question}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((o, i) => {
          let bg = "#f8f9fb", bd = P.border, tc = P.text;
          if (revealed) { if (i === correctIdx) { bg = P.correctBg; bd = P.correct; tc = P.correct; } else if (i === sel) { bg = P.wrongBg; bd = P.wrong; tc = P.wrong; } else { tc = P.textLight; } }
          return <button key={i} onClick={() => { if (!revealed) { setSel(i); setRevealed(true); } }} style={{ padding: "12px 16px", borderRadius: 10, border: `2px solid ${bd}`, background: bg, textAlign: "left", cursor: revealed ? "default" : "pointer", fontSize: 14, color: tc, fontWeight: revealed && i === correctIdx ? 700 : 400, lineHeight: 1.5 }}>{o}</button>;
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
      <Title>The Role of the Contract Administrator</Title><Sub>JCT SBC/Q 2024 — Powers, Duties, Independence & Case Law</Sub>
      <Pg>This module examines the role of the Architect/Contract Administrator under the JCT SBC/Q 2024 — arguably the most important role in the administration of a traditional building contract. The CA issues instructions, certifies payments, grants extensions of time, certifies Practical Completion, and manages the final account. Getting any of these wrong can have serious consequences for both the Employer and the Contractor.</Pg>
      <Pg>The defining feature of the CA's role is its <strong>dual nature</strong>: the CA is appointed and paid by the Employer, but must act as an <strong>independent and impartial certifier</strong> when exercising certain functions. Understanding this tension — and the case law that has shaped it — is the key to administering the contract properly.</Pg>
      <H3>How This Module Works</H3>
      <Pg>Each section follows a consistent structure: first we <strong>explain the principles</strong> and the relevant clauses, then we <strong>illustrate with examples and case law</strong>, and finally you <strong>practise</strong> through interactive exercises. The final tab — the <strong>Simulator</strong> — puts you in the CA's chair on a live project, responding to emails from the Employer, Contractor, and Quantity Surveyor.</Pg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px 0" }}>
        {[{ t: "The Dual Role", c: "Article 4", d: "Appointment, independence, and replacement" }, { t: "Instructions", c: "Cl. 3.10–3.22", d: "Powers, compliance, oral instructions, ultra vires" }, { t: "Certification", c: "Cl. 1.8, 2.30–2.39, 4.9, 4.26", d: "Every certificate and its time limits" }, { t: "EOT & Loss/Expense", c: "Cl. 2.26–2.29 & 4.20–4.24", d: "Decision-making duties and consequences" }, { t: "Key Case Law", c: "Landmark Decisions", d: "Sutcliffe, Merton, Panamena, and more" }].map((x, i) => <Card key={i} style={{ padding: "14px 16px" }}><div style={{ fontSize: 11, fontWeight: 700, color: P.teal, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{x.c}</div><div style={{ fontSize: 14, fontWeight: 700, color: P.navy, marginBottom: 4 }}>{x.t}</div><div style={{ fontSize: 13, color: P.textMid, lineHeight: 1.4 }}>{x.d}</div></Card>)}
      </div>
      <Tip icon="⚖️" title="The Central Tension" accent={P.gold} bg={P.goldPale}>
        The Architect/Contract Administrator is appointed by the Employer, paid by the Employer, and is typically the Employer's design consultant. Yet when certifying, the CA must certify the sum they genuinely consider due — even if the Employer disagrees. As the House of Lords established in <em>Sutcliffe v Thackrah</em> [1974], this independent certifying function is fundamental to the contract's payment machinery.
      </Tip>
    </>);

    case "dual-role": return (<>
      <Title>The Dual Role</Title><Sub>Article 4, Clauses 3.3–3.6</Sub>

      <H3>Appointment</H3>
      <Pg>The Architect/Contract Administrator is named in <strong>Article 4</strong> of the Agreement. This is a personal appointment — the Contractor enters into the contract on the understanding that this particular person or firm will administer it. The CA's identity is a material term of the contract.</Pg>
      <Pg>In practice, the CA is usually the project architect who designed the building, but the role can be filled by any suitably qualified professional. The 2024 edition uses the composite term "Architect/Contract Administrator" to reflect this flexibility.</Pg>

      <H3>The Independence Obligation</H3>
      <Pg>The CA occupies two distinct roles simultaneously. When <strong>issuing instructions</strong> — ordering variations, requiring the opening up of work, postponing operations — the CA is exercising powers conferred by the contract, broadly on behalf of the Employer. But when <strong>certifying</strong> — interim payments, Practical Completion, extensions of time, the Final Certificate — the CA must act as an <strong>independent professional</strong>, forming their own honest opinion regardless of the Employer's wishes.</Pg>
      <Pg>The JCT Guide (paragraph 79) expressly warns that the CA should <strong>not</strong> be appointed as the Employer's representative under Clause 3.3, precisely because of the conflict between representing the Employer and certifying independently. The footnote to Clause 3.3 in the contract itself makes the same point.</Pg>
      <Pg>This principle was established by the House of Lords in <strong>Sutcliffe v Thackrah [1974]</strong>, which confirmed that the architect acts as an independent certifier when valuing and certifying payments — not as the Employer's agent. The consequence is significant: the CA can be sued by the <em>Employer</em> for negligent over-certification (certifying more than was due), because the duty of care runs to the Employer who appointed them.</Pg>

      <H3>Replacement</H3>
      <Pg><strong>Clause 3.5.1</strong> requires that if a replacement CA is needed, the new appointment must be made within <strong>21 days</strong>. The Contractor has a right of reasonable objection to the replacement (except where the Employer is a local or public authority appointing an authority official). This right of objection underscores the personal nature of the appointment — the Contractor agreed to be administered by a particular person.</Pg>
      <Pg><strong>Clause 3.5.2</strong> provides that a replacement CA is <strong>bound by the acts of their predecessor</strong>. They cannot overrule or disregard any certificate, opinion, decision, consent, approval or instruction given by their predecessor, except to the extent that the predecessor could have done so themselves. This prevents a new CA from retrospectively reopening settled decisions.</Pg>

      <H3>What the CA Is NOT</H3>
      <Pg>The CA does not owe a duty of care to the <strong>Contractor</strong>. In <strong>Cantrell v Wright & Fuller [2003]</strong>, the court confirmed that the Contractor's remedy for unfair certification is through the contract's dispute resolution provisions — not a negligence claim against the CA. The CA's professional duties run to the Employer who appointed them.</Pg>
      <Pg>Equally, the CA is not an arbitrator. <strong>Clause 3.6</strong> makes clear that the Contractor remains wholly responsible for carrying out the works — neither inspection by the CA, nor the inclusion of work in a certificate, nor the issue of any certificate relieves the Contractor of that responsibility (subject to the conclusive effect of the Final Certificate under Clause 1.9).</Pg>

      <H3>Example</H3>
      <Pg>An Employer appoints Smith Architects as CA on a £6 million office refurbishment. Midway through construction, the senior partner at Smith Architects retires. Under Clause 3.5.1, the Employer must appoint a replacement within 21 days. The Contractor objects to the proposed replacement on reasonable grounds (perhaps a prior professional dispute). The Employer must propose an alternative. The new CA inherits everything the predecessor decided — they cannot, for example, revisit the previous CA's extension of time decision unless the predecessor themselves could have reviewed it under Clause 2.28.5.</Pg>

      <H3>Test Yourself</H3>
      <PredictReveal question="The Employer's Finance Director pressures the CA to reduce a payment certificate to manage the Employer's cash flow. What should the CA do?" options={["Comply — the CA is appointed by the Employer and must follow their instructions", "Refuse — the CA must certify the sum they genuinely consider due, regardless of the Employer's financial position", "Issue two certificates — one at the Employer's figure and one at the CA's figure"]} correctIdx={1} explanation="Correct. When certifying payment, the CA acts as an independent certifier, not as the Employer's agent. The sum certified must be the sum the CA genuinely considers due based on the Quantity Surveyor's valuation. If the Employer interferes with this function, the Employer cannot rely on the certificate — this principle was established in Panamena Europea Navegacion v Frederick Leyland [1947] AC 428." />
      <PredictReveal question="A replacement CA is appointed under Clause 3.5. Can the new CA withdraw a Practical Completion Certificate issued by their predecessor?" options={["Yes — a new CA starts fresh and can review all previous decisions", "No — Clause 3.5.2 binds the replacement to the predecessor's acts, except where the predecessor could have changed them", "Only if the Contractor consents"]} correctIdx={1} explanation="Correct. Clause 3.5.2 prevents the replacement from disregarding or overruling any certificate, opinion, decision, consent, approval or instruction given by a predecessor. The new CA can only change what the predecessor themselves had power to change. A Practical Completion Certificate, once issued, cannot be withdrawn by its issuer (there is no contractual power to do so), so a successor cannot withdraw it either." />
    </>);

    case "instructions": return (<>
      <Title>Instructions</Title><Sub>Clauses 3.10–3.22</Sub>

      <H3>The General Power</H3>
      <Pg>Under <strong>Clause 3.10</strong>, the Contractor must comply <strong>forthwith</strong> with all instructions issued by the CA, provided the instruction is empowered by a specific provision of the Conditions. This is a broad power, but it is not unlimited — the CA cannot instruct the Contractor to do anything; only what the contract expressly empowers.</Pg>
      <Pg>All instructions must be <strong>in writing</strong>. If the CA gives an oral instruction (as often happens on site), Clause 3.12 provides a confirmation mechanism: the Contractor has 7 days to confirm it in writing. If the CA does not dissent within a further 7 days, the instruction takes effect. If neither party confirms but the Contractor complies anyway, the CA can confirm it retrospectively at any time before the Final Certificate.</Pg>

      <H3>The Four Exceptions to Immediate Compliance</H3>
      <Pg>There are four situations where the Contractor need not comply immediately:</Pg>
      <Pg><strong>1. Variations affecting access, working space, hours, or order of working (Cl. 3.10.1):</strong> The Contractor may make reasonable written objection. This protects the Contractor from instructions that fundamentally disrupt their programme without proper consideration.</Pg>
      <Pg><strong>2. Instructions injurious to CDP design or CDM/Building Regulations compliance (Cl. 3.10.3):</strong> If an instruction would have an injurious practical effect on the Contractor's Designed Portion or prevent compliance with CDM or Building Regulations, the Contractor must give notice. However, if the CA then confirms the instruction, the Contractor must comply immediately.</Pg>
      <Pg><strong>3. Patent use (Cl. 3.10.4):</strong> Where further instructions are needed regarding patent rights.</Pg>
      <Pg><strong>4. Named Specialists (Cl. 3.10.5):</strong> Where further instructions are needed regarding Named Specialists.</Pg>

      <H3>Non-Compliance</H3>
      <Pg>If the Contractor does not comply with an instruction within <strong>7 days</strong> of the CA giving written notice requiring compliance (Clause 3.11), the Employer may engage others to carry out the work. The Contractor is liable for all additional costs, which are deducted from the Contract Sum.</Pg>

      <H3>Challenging an Instruction</H3>
      <Pg><strong>Clause 3.13</strong> gives the Contractor the right to ask the CA to identify which clause empowers a particular instruction. The CA must comply with this request forthwith. If the Contractor then complies without either party invoking dispute resolution, the instruction is deemed validly given. This principle was foreshadowed in <strong>Simplex Concrete Piles v St Pancras [1958]</strong>, which established that a contractor who complies under protest preserves the right to argue an instruction was beyond the architect's powers.</Pg>

      <H3>Specific Instruction Powers</H3>
      <Pg><strong>Variations (Cl. 3.14):</strong> The CA may instruct variations to the design, quality, or quantity of the works. This is a significant power — without it, neither party could change the scope of work after the contract is signed. But it has limits: a variation instruction cannot fundamentally change the nature of the contracted works.</Pg>
      <Pg><strong>Postponement (Cl. 3.15):</strong> The CA may instruct postponement of any work. This is a Relevant Event (giving time) and a Relevant Matter (giving money).</Pg>
      <Pg><strong>Provisional Sums (Cl. 3.16):</strong> The CA has a <strong>duty</strong> (not merely a power) to issue instructions on the expenditure of Provisional Sums.</Pg>
      <Pg><strong>Opening up and testing (Cl. 3.17):</strong> The CA may instruct the opening up of work or testing of materials. If the work proves compliant, the Contractor is entitled to payment and an extension of time. If non-compliant, the Contractor bears the cost.</Pg>
      <Pg><strong>Non-compliant work (Cl. 3.18–3.19):</strong> Where work or materials do not comply with the contract, the CA has broad powers to require removal, re-execution, or alteration. Under Clause 3.18.4, if the CA wants to investigate whether non-compliance is more widespread, they must have regard to the Code of Practice in Schedule 4.</Pg>
      <Pg><strong>Executed work (Cl. 3.20):</strong> Where materials or workmanship are required to be to the CA's reasonable satisfaction, the CA must give reasons for any dissatisfaction within a reasonable time. This duty protects the Contractor from arbitrary rejection.</Pg>
      <Pg><strong>Exclusion from site (Cl. 3.21):</strong> The CA may instruct the exclusion of any person from the site, but must not do so unreasonably or vexatiously.</Pg>
      <Pg><strong>Antiquities, asbestos, contaminated material, and unexploded ordnance (Cl. 3.22):</strong> New in 2024, the CA must issue instructions when any of these are discovered. The Contractor must cease work where continuing would endanger health and safety, and report the discovery to both the CA and the Employer.</Pg>

      <H3>Test Yourself</H3>
      <SortExercise title="📋 Put the oral instruction procedure in order" instruction="Arrange these steps in the correct sequence under Clause 3.12." items={["CA gives oral instruction on site", "Contractor confirms in writing within 7 days", "CA has 7 days to dissent from Contractor's confirmation", "If no dissent, instruction takes effect at expiry of the second 7-day period"]} correctOrder={["CA gives oral instruction on site", "Contractor confirms in writing within 7 days", "CA has 7 days to dissent from Contractor's confirmation", "If no dissent, instruction takes effect at expiry of the second 7-day period"]} />
      <PredictReveal question="The Contractor receives a CA instruction but believes the CA has no contractual power to issue it. What is the Contractor's best course of action?" options={["Refuse to comply and do nothing", "Request the CA to specify which clause empowers the instruction (Cl. 3.13), then comply under protest while invoking dispute resolution if necessary", "Comply without question — all CA instructions must be obeyed"]} correctIdx={1} explanation="Correct. Clause 3.13 gives the Contractor the right to ask which provision empowers the instruction, and the CA must answer forthwith. If the Contractor then complies without either party invoking dispute resolution, the instruction is deemed valid. But by requesting the clause reference, the Contractor puts the CA on notice. If the instruction is genuinely ultra vires, the Contractor can comply under protest and challenge it through adjudication or arbitration. Simply refusing to comply risks triggering the Clause 3.11 non-compliance procedure." />
    </>);

    case "certification": return (<>
      <Title>Certification</Title><Sub>The CA's Certificates and Their Time Limits</Sub>

      <H3>The Principle</H3>
      <Pg>The CA is required to issue a series of certificates throughout the life of the contract. Each has a specific trigger, a defined time limit, and significant consequences. <strong>Clause 1.8</strong> requires every certificate to be issued to <strong>both the Employer and the Contractor at the same time</strong>. No certificate (other than the Final Certificate) is conclusive evidence that the work complies with the contract (Clause 1.10).</Pg>

      <H3>Interim Certificates (Cl. 4.9)</H3>
      <Pg>The CA must issue Interim Certificates stating the amount due to the Contractor. The due date is <strong>7 days</strong> after the Interim Valuation Date (Clause 4.8). The certificate must be issued within <strong>5 days</strong> of the due date (Clause 4.9.1). The Quantity Surveyor prepares the valuation; the CA certifies. These are distinct roles — the CA is not simply rubber-stamping the QS's figures but retains the discretion and duty to certify the amount they genuinely consider due.</Pg>

      <H3>Practical Completion Certificate (Cl. 2.30)</H3>
      <Pg>The CA must issue a Practical Completion Certificate <strong>forthwith</strong> when, in their opinion, practical completion is achieved and the Contractor has complied sufficiently with their obligations regarding as-built drawings and health and safety file matters. The contract does not define "practical completion" — the case law fills the gap.</Pg>
      <Pg>In <strong>H W Nevill (Sunblest) v William Press [1981]</strong>, Judge Newey QC held that practical completion means the works are complete for all practical purposes, free from patent defects. Minor snagging items do not prevent practical completion, but anything that prevents the building being used for its intended purpose does. In <strong>Westminster City Council v Jarvis [1970]</strong>, Lord Salmon's formulation was that the works must be free from any defect "other than one which is so trifling as to be negligible."</Pg>
      <Pg>The practical consequences of this certificate are enormous: it triggers the Rectification Period, releases half the retention, ends the Contractor's liability for liquidated damages, transfers insurance responsibility for the works to the Employer, and starts the clock running towards the Final Certificate.</Pg>

      <H3>Non-Completion Certificate (Cl. 2.31)</H3>
      <Pg>If the Contractor fails to complete the Works by the Completion Date, the CA <strong>shall</strong> issue a Non-Completion Certificate. This is a mandatory duty, not a discretion. The certificate is a prerequisite to the Employer's right to deduct liquidated damages under Clause 2.32. If the CA subsequently grants an extension of time, the Non-Completion Certificate must be cancelled and a new one issued if the Contractor still exceeds the revised Completion Date.</Pg>

      <H3>Certificate of Making Good (Cl. 2.39)</H3>
      <Pg>After the Contractor has made good defects identified during the Rectification Period, the CA issues a Certificate of Making Good. This triggers the release of the <strong>second half of retention</strong> and is one of the triggers for the Final Certificate timetable.</Pg>

      <H3>Final Certificate (Cl. 4.26)</H3>
      <Pg>The CA must issue the Final Certificate within <strong>2 months</strong> of whichever occurs last of: the end of the Rectification Period, the Certificate of Making Good, or the final adjustment statement. The Final Certificate has powerful <strong>conclusive effect</strong> under Clause 1.9 — it is conclusive evidence that quality standards were to the CA's satisfaction, that all adjustments have been made, that all extensions of time have been given, and that loss and expense amounts are in final settlement.</Pg>
      <Pg>If the CA fails to issue the Final Certificate within the time limit, the obligation to certify continues — but the delay may give rise to a claim by the Employer against the CA in negligence, as discussed in <strong>Colbart v Kumar [1992]</strong>.</Pg>

      <H3>Test Yourself</H3>
      <SortExercise title="📜 Certificates in chronological order" instruction="Arrange these certificates in the order they typically occur during a project." items={["Interim Certificates (monthly during construction)", "Practical Completion Certificate", "Non-Completion Certificate (only if Contractor is late)", "Certificate of Making Good (after Rectification Period)", "Final Certificate"]} correctOrder={["Interim Certificates (monthly during construction)", "Non-Completion Certificate (only if Contractor is late)", "Practical Completion Certificate", "Certificate of Making Good (after Rectification Period)", "Final Certificate"]} />
      <PredictReveal question="The works are substantially complete but there is a persistent leak in the roof that prevents the building being occupied. Should the CA issue the Practical Completion Certificate?" options={["Yes — the works are substantially complete and minor issues can be dealt with in the Rectification Period", "No — a defect that prevents the building being used for its intended purpose means practical completion has not been achieved", "Issue the certificate but attach a list of defects"]} correctIdx={1} explanation="Correct. Following H W Nevill (Sunblest) v William Press [1981], practical completion requires the works to be complete for all practical purposes, free from patent defects. A roof leak that prevents occupation is not a 'trifling' defect — it prevents the building being used for its intended purpose. The CA should not certify practical completion until the leak is resolved. Snagging items (minor paint touch-ups, a stiff door handle) do not prevent practical completion; structural or functional defects do." />
    </>);

    case "eot-loss": return (<>
      <Title>Extensions of Time & Loss and Expense</Title><Sub>Clauses 2.26–2.29 & 4.20–4.24</Sub>

      <H3>Extensions of Time — The Duty</H3>
      <Pg>When the Contractor notifies the CA of a delay caused by a Relevant Event (Clause 2.29), the CA has a <strong>duty</strong> — not merely a discretion — to consider whether an extension of time is warranted, and to grant such extension as is fair and reasonable (Clause 2.28.1). The CA must notify the Contractor of their decision within <strong>8 weeks</strong> of receiving the Contractor's particulars (reduced from 12 weeks in the 2024 edition — SBC Guide paragraph 62).</Pg>
      <Pg>This duty was established in <strong>London Borough of Merton v Stanley Hugh Leach [1985]</strong>, which held that the architect has an <em>implied contractual duty</em> to exercise the extension of time power properly. The consequence of failing to do so is severe: if the CA does not grant a proper extension when a Relevant Event has occurred, <strong>time is set at large</strong> and the Employer loses the right to deduct liquidated damages entirely. The Completion Date effectively disappears, replaced by an obligation to complete within a "reasonable time."</Pg>

      <H3>The Post-Completion Review</H3>
      <Pg>Under <strong>Clause 2.28.5</strong>, immediately following practical completion, the CA has both the power and a <strong>duty</strong> to review the overall position on extensions of time. This review may look at all the circumstances, including Relevant Events that may not have been specifically notified under Clause 2.27. The CA can fix a later Completion Date, an earlier one (for Relevant Omissions only), or confirm the existing date.</Pg>
      <Pg><strong>Balfour Beatty v Chestermount Properties [1993]</strong> clarified an important limitation: when reviewing extensions post-completion, the CA cannot fix a completion date earlier than the date previously fixed, except to the extent that the original extension was attributable to a Relevant Omission (i.e., work that was subsequently omitted by variation). In no circumstances can the date be fixed earlier than the original Completion Date in the Contract Particulars (Clause 2.28.6.4).</Pg>

      <H3>Loss and Expense — The Ascertainment Duty</H3>
      <Pg>Where the Contractor's regular progress is materially affected by a <strong>Relevant Matter</strong> (listed in Clause 4.22), the CA or QS must ascertain the amount of direct loss and/or expense. The distinction between Relevant Events (time) and Relevant Matters (money) is critical — some events appear on both lists (e.g., variations, postponement, impediment by the Employer), while others appear on only one (e.g., exceptionally adverse weather gives time but not money).</Pg>
      <Pg>The CA or QS must respond with an ascertained amount within <strong>28 days</strong> of the initial submission and <strong>14 days</strong> of each monthly update (Clause 4.21.4). Amounts ascertained are added to the Contract Sum (Clause 4.23). The Contractor's other rights and remedies at common law are expressly preserved (Clause 4.24).</Pg>

      <H3>Example</H3>
      <Pg>A Contractor notifies the CA that progress has been delayed by 4 weeks due to the CA's late issue of structural drawings. This falls under Relevant Event Clause 2.29.7 (impediment, prevention or default by the Employer or Employer's Persons) and Relevant Matter Clause 4.22.5 (the equivalent provision for loss and expense). The CA must consider an extension of time within 8 weeks and the QS must ascertain the direct loss and expense for the period of delay. If the CA ignores the notification and fails to extend time, the Employer's liquidated damages clause is at risk — per <em>Merton v Leach</em>, time may be set at large.</Pg>

      <H3>Test Yourself</H3>
      <SortExercise title="⚖️ Sort: Time, Money, or Both?" instruction="Drag these so that events giving BOTH time and money are at the top (first 3), events giving time ONLY in the middle (next 3), and the one giving NEITHER at the bottom." items={["Variations instructed by the CA (time + money)", "Late information from the CA (time + money)", "Postponement instructed by the CA (time + money)", "Exceptionally adverse weather (time only)", "Force majeure (time only)", "Civil commotion (time only)", "Contractor underpriced the brickwork (neither)"]} correctOrder={["Variations instructed by the CA (time + money)", "Late information from the CA (time + money)", "Postponement instructed by the CA (time + money)", "Exceptionally adverse weather (time only)", "Force majeure (time only)", "Civil commotion (time only)", "Contractor underpriced the brickwork (neither)"]} />
      <PredictReveal question="The CA fails to grant an extension of time for a valid Relevant Event. What is the consequence for the Employer?" options={["Nothing — the Completion Date remains unchanged", "The Employer may lose the right to deduct liquidated damages because time is 'set at large' — the Contractor need only complete within a reasonable time", "The CA is personally liable for the liquidated damages the Employer cannot recover"]} correctIdx={1} explanation="Correct. Merton v Stanley Hugh Leach [1985] established that the CA has an implied contractual duty to exercise the extension of time power. If they fail to do so when a Relevant Event has occurred, time is set at large — the fixed Completion Date disappears and with it the Employer's right to deduct liquidated damages. The Contractor's obligation becomes simply to complete within a reasonable time. This is one of the most significant consequences of CA failure in the entire contract." />
    </>);

    case "case-law": return (<>
      <Title>Key Case Law</Title><Sub>Principles from the Courts</Sub>

      <H3>The Independence Obligation</H3>
      <Pg><strong>Sutcliffe v Thackrah [1974] AC 727</strong> (House of Lords) — The foundational authority. When certifying interim payments, the architect acts as an independent certifier, not as the Employer's agent. The architect owes a duty of care to the Employer to certify competently, and can be liable in negligence for over-certification — in this case, certifying defective work that led the Employer to overpay the contractor.</Pg>
      <Pg><strong>Scheldebouw BV v St James Homes [2006] EWHC 89 (TCC)</strong> — Jackson J (as he then was) held that where a contract administrator fails to act impartially in certifying, the resulting certificate can be opened up in adjudication. Impartiality is not optional — it is a contractual obligation.</Pg>
      <Pg><strong>Cantrell v Wright & Fuller [2003] BLR 412</strong> — The CA does not owe a duty of care to the Contractor. The Contractor's remedy for unfair certification is to challenge the certificate through the dispute resolution provisions, not to sue the CA directly.</Pg>

      <H3>Employer Interference</H3>
      <Pg><strong>Panamena Europea Navegacion v Frederick Leyland [1947] AC 428</strong> (House of Lords) — If the Employer interferes with the architect's independent certifying function (for example, pressuring them to under-certify), the Employer cannot then rely on the certificate. The certificate becomes unreliable, and the Contractor can challenge it. This is the case law authority for the principle that the Employer must not lean on the CA to reduce certificates for cash flow or other improper reasons.</Pg>

      <H3>Extensions of Time</H3>
      <Pg><strong>London Borough of Merton v Stanley Hugh Leach [1985] 32 BLR 51</strong> — The architect has an implied contractual duty to exercise the extension of time power. Failure to grant a proper extension when a Relevant Event has occurred sets time at large, destroying the Employer's right to liquidated damages.</Pg>
      <Pg><strong>Balfour Beatty v Chestermount Properties [1993] 62 BLR 1</strong> — On the post-completion review of extensions of time, the architect cannot fix a completion date earlier than the date previously fixed, except to the extent attributable to a Relevant Omission. This prevents the CA from retrospectively tightening the programme against the Contractor.</Pg>

      <H3>Practical Completion</H3>
      <Pg><strong>H W Nevill (Sunblest) v William Press [1981] 20 BLR 78</strong> — Practical completion means the works are complete for all practical purposes, free from patent defects. Minor snagging items do not prevent practical completion; defects that prevent the building being used for its intended purpose do.</Pg>
      <Pg><strong>Westminster City Council v Jarvis [1970] 1 WLR 637</strong> — Lord Salmon held that practical completion requires the works to be free from defects "other than one which is so trifling as to be negligible." This formulation is frequently cited to distinguish between minor snagging (which does not prevent PC) and substantive defects (which do).</Pg>

      <H3>The Final Certificate</H3>
      <Pg><strong>Crown Estate Commissioners v John Mowlem [1994] 70 BLR 1</strong> (Court of Appeal) — The conclusive effect of the Final Certificate is limited to the matters expressly listed in the conclusive-effect clause (now Clause 1.9.1). It does not extend to all aspects of the works. This means, for example, that latent defects not covered by the expressly listed matters may still be pursued after the Final Certificate.</Pg>
      <Pg><strong>Colbart v Kumar [1992] 59 BLR 89</strong> — The architect's obligation to issue the Final Certificate continues even after the contractual deadline passes. But the delay may give rise to a professional negligence claim against the architect — particularly if the Contractor or Employer suffers loss as a result of the delay (for example, being unable to close out the contract and release retention).</Pg>

      <H3>Liquidated Damages</H3>
      <Pg><strong>Triple Point Technology v PTT [2021] UKSC 29</strong> — Where the Contractor's employment is terminated during culpable delay, liquidated damages apply only up to the date of termination. After that, the Employer must claim general damages. This principle is now codified in <strong>Clause 2.32.5</strong> of the SBC 2024.</Pg>
      <Pg><strong>Cavendish Square v Makdessi / ParkingEye v Beavis [2015] UKSC 67</strong> — The Supreme Court reformulated the penalty test. The question is no longer whether liquidated damages are a "genuine pre-estimate of loss" (the old Dunlop test), but whether the clause imposes a detriment "out of all proportion to any legitimate interest" of the innocent party. This gives employers greater freedom to set deterrent rates, provided they are not unconscionable.</Pg>

      <Tip icon="📚" title="Case Law in Practice">
        These cases are not just academic. They arise in adjudication regularly. A CA who has never heard of <em>Merton v Leach</em> may fail to extend time, setting time at large. A CA who does not understand <em>Panamena</em> may yield to Employer pressure on certificates, making those certificates vulnerable to challenge. Understanding the case law is part of the professional competence the role demands.
      </Tip>

      <H3>Test Yourself</H3>
      <PredictReveal question="In Sutcliffe v Thackrah, who was liable to whom and for what?" options={["The Contractor was liable to the Employer for defective work", "The Architect was liable to the Employer for negligent over-certification — certifying defective work that led to overpayment", "The Employer was liable to the Contractor for underpayment"]} correctIdx={1} explanation="Correct. The House of Lords held that the architect owed a duty of care to the Employer when certifying. By negligently including defective work in interim certificates, the architect caused the Employer to overpay the contractor. The Employer recovered the loss from the architect. This case established that the architect's certifying function carries professional responsibility — it is not merely an administrative formality." />
      <PredictReveal question="What is the practical consequence of the Merton v Leach principle for a CA who ignores a valid delay notification?" options={["The Contractor loses the right to claim an extension", "Nothing — the Completion Date is unaffected", "Time is set at large: the fixed Completion Date disappears and the Employer loses the right to deduct liquidated damages"]} correctIdx={2} explanation="Correct. This is one of the most important principles in JCT contract administration. If the CA fails to grant a proper extension when a Relevant Event has occurred, the contractual machinery for fixing the Completion Date breaks down. Without a valid Completion Date, there can be no liquidated damages. The Contractor's obligation becomes simply to complete within a reasonable time. The Employer's loss can be enormous — a six-figure liquidated damages entitlement can vanish because of the CA's failure to act." />
    </>);

    default: return null;
  }
}

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
    <div style={{ background: S.bg, borderRadius: 16, padding: "28px 24px", margin: "-24px -28px", minHeight: "80vh" }}>
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

// ─── SIDEBAR ────────────────────────────────────────────────────────
function Sidebar({ current, setCurrent }) {
  return (
    <nav style={{ width: 240, minHeight: "100%", background: P.navy, padding: "24px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${P.navyLight}` }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: P.gold, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Module 3</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: P.white, lineHeight: 1.3 }}>Contract Administrator</div>
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
export default function Module3() {
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
