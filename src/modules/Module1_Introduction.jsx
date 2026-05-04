import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   JCT SBC/Q 2024 — Module 1: Introduction and When to Use It
   Learning Module + Contract Selection Simulator
   ═══════════════════════════════════════════════════════════════════════ */

function BackLink() { return <Link to="/" style={{ position: "fixed", top: 16, right: 20, zIndex: 999, padding: "7px 16px", borderRadius: 8, background: "rgba(15,42,68,0.85)", color: "#fff", fontSize: 12, fontWeight: 600, textDecoration: "none", letterSpacing: 0.5, backdropFilter: "blur(8px)" }}>← All Modules</Link>; }
const P = { navy: "#0f2a44", navyLight: "#1a3d5c", teal: "#1a8a7d", tealLight: "#2bb5a4", tealPale: "#e8f6f4", gold: "#d4a843", goldPale: "#fdf6e3", cream: "#faf8f5", white: "#ffffff", text: "#1e2a3a", textMid: "#4a5c6e", textLight: "#7a8c9e", border: "#dde3ea", correct: "#22855b", correctBg: "#e8f5ef", wrong: "#c0392b", wrongBg: "#fdeaea", shadow: "0 2px 16px rgba(15,42,68,0.07)" };
const S = { bg: "#0c1b2e", card: "#132840", accent: "#e8a838", accentDim: "#c48a24", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", ok: "#34d399", okBg: "rgba(52,211,153,0.12)", bad: "#f87171", badBg: "rgba(248,113,113,0.1)", bdr: "#1e3a5f" };

const SECTIONS = [
  { id: "overview", title: "Overview", sub: "Module 1 at a Glance" },
  { id: "what-is", title: "What Is the SBC/Q?", sub: "Purpose & Scope" },
  { id: "when-to-use", title: "When to Use It", sub: "Criteria & Context" },
  { id: "key-roles", title: "Key Roles", sub: "Articles 1–7" },
  { id: "structure", title: "Contract Structure", sub: "Agreement & Conditions" },
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

// ─── INTERACTIVE: SORT ──────────────────────────────────────────────
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
      <Title>Introduction and When to Use It</Title><Sub>JCT Standard Building Contract With Quantities 2024</Sub>
      <Pg>This module introduces the JCT Standard Building Contract With Quantities 2024 (SBC/Q). It covers what the contract is, in what circumstances it should be used, who the key parties are, and how the contract is structured. By the end, you will be able to select the most appropriate JCT contract form for a given project scenario.</Pg>
      <Pg>Each section follows a consistent structure: first we <strong>explain the principles</strong>, then <strong>illustrate with examples</strong>, and finally you <strong>practise</strong> through interactive exercises. The final tab — the <strong>Simulator</strong> — presents you with real-world project briefs and asks you to choose the appropriate contract.</Pg>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px 0" }}>
        {[{ t: "What Is the SBC/Q?", d: "Purpose, scope, and the lump sum principle" }, { t: "When to Use It", d: "Criteria, procurement context, and alternatives" }, { t: "Key Roles", d: "Employer, Contractor, Architect/Contract Administrator, Quantity Surveyor" }, { t: "Contract Structure", d: "Agreement, Conditions, and Schedules" }].map((x, i) => <Card key={i} style={{ padding: "14px 16px" }}><div style={{ fontSize: 14, fontWeight: 700, color: P.navy, marginBottom: 4 }}>{x.t}</div><div style={{ fontSize: 13, color: P.textMid, lineHeight: 1.4 }}>{x.d}</div></Card>)}
      </div>
    </>);

    case "what-is": return (<>
      <Title>What Is the SBC/Q 2024?</Title><Sub>Purpose and scope</Sub>

      <H3>The Principle</H3>
      <Pg>The JCT Standard Building Contract With Quantities 2024 (SBC/Q) is a <strong>lump sum contract</strong> published by the Joint Contracts Tribunal (JCT). It is the most comprehensive standard form in the JCT family and is designed for use on <strong>larger, more complex building projects</strong> where the Employer provides the Contractor with detailed drawings and bills of quantities that define both the quantity and quality of the work to be carried out.</Pg>
      <Pg>The SBC/Q is firmly rooted in the <strong>traditional procurement method</strong> — sometimes called "design-bid-build." Under this arrangement, the Employer retains control of the design through professional consultants (typically an architect) and engages a Contractor to construct the works. The Employer's Quantity Surveyor measures the design and prepares bills of quantities using the RICS New Rules of Measurement (NRM2). The project is then tendered on the basis of these documents, and the successful Contractor enters into the SBC/Q to construct the works in accordance with the design provided.</Pg>
      <Pg>Because it is a lump sum contract, the Contractor generally bears the risk that the work costs more than was allowed for in the Contract Sum. The Contract Sum is stated exclusive of VAT and can only be adjusted in accordance with the express provisions of the Conditions — this is the "closed system" explained in Module 6.</Pg>

      <H3>Example</H3>
      <Pg>A university commissions a new £8 million teaching building. The university appoints an architect to design the building in detail and a Quantity Surveyor to prepare bills of quantities. Six contractors are invited to tender based on these documents. The successful contractor enters into an SBC/Q 2024 contract. The architect and Quantity Surveyor then administer the contract during construction — the architect issues instructions and certifies payments, while the Quantity Surveyor values the work and variations.</Pg>
      <Pg>This is the classic SBC/Q scenario: a fully designed project, measured by bills of quantities, with professional consultants administering the contract on the Employer's behalf.</Pg>

      <Tip icon="💡" title="Lump Sum — What Does It Mean in Practice?">The Contractor prices the work based on the bills of quantities and takes the risk of underpricing. If the Contractor's estimate of the cost of brickwork turns out to be too low, the Contractor absorbs that loss. Conversely, the Employer cannot reduce the Contract Sum simply because it considers the price too high. Adjustments are only permitted where the Conditions expressly allow — such as for instructed variations, loss and expense, or fluctuations.</Tip>

      <H3>Test Yourself</H3>
      <PredictReveal question="The SBC/Q is described as a 'lump sum contract.' What does this mean?" options={["The Employer pays a fixed price regardless of the actual cost of the work", "The Contractor prices based on the bills of quantities and bears the risk of underpricing, but the sum can be adjusted under the express provisions of the Conditions", "The Contract Sum is recalculated each month based on actual expenditure"]} correctIdx={1} explanation="Correct. The SBC/Q is a lump sum contract, but it is not a fixed price in the absolute sense. The Contract Sum can be adjusted — but only where the Conditions expressly permit it (Clause 4.2). The Contractor bears the risk of its own pricing, while the Employer bears the risk of design changes it instructs." />
      <PredictReveal question="What procurement method is the SBC/Q designed for?" options={["Design and build — the Contractor designs and constructs", "Traditional (design-bid-build) — the Employer provides the design and the Contractor constructs", "Management contracting — a management contractor oversees trade packages"]} correctIdx={1} explanation="Correct. The SBC/Q assumes the Employer has prepared a full design through professional consultants and has had bills of quantities prepared. The Contractor's role is to construct the works in accordance with that design. If the Employer wants to shift overall design responsibility to the Contractor, the JCT Design and Build Contract (DB 2024) would be more suitable." />
    </>);

    case "when-to-use": return (<>
      <Title>When Is the SBC/Q Appropriate?</Title><Sub>Criteria, alternatives, and the Contractor's Designed Portion</Sub>

      <H3>The Primary Criteria</H3>
      <Pg>The JCT states on the face of the contract that the SBC/Q is appropriate in the following circumstances:</Pg>
      <Pg><strong>1.</strong> The works are <strong>larger in scale and complexity</strong>, requiring detailed contract provisions.</Pg>
      <Pg><strong>2.</strong> The design has been prepared <strong>by or on behalf of the Employer</strong>, who provides the Contractor with drawings.</Pg>
      <Pg><strong>3.</strong> <strong>Bills of quantities</strong> have been prepared to define the quantity and quality of the work.</Pg>
      <Pg><strong>4.</strong> An <strong>Architect/Contract Administrator and a Quantity Surveyor</strong> are appointed to administer the conditions.</Pg>

      <H3>Additional Uses</H3>
      <Pg>The contract can also be used where:</Pg>
      <Pg><strong>Contractor's Designed Portion (CDP):</strong> The Contractor is to design discrete parts of the works. This does not convert the contract into a design and build arrangement — the Employer retains overall design responsibility, but specific elements (such as mechanical and electrical installations, cladding systems, or specialist structural elements) may be delegated to the Contractor. Where there is a Contractor's Designed Portion, the Ninth to Twelfth Recitals apply, identifying the Employer's Requirements, the Contractor's Proposals, and the CDP Analysis.</Pg>
      <Pg><strong>Sectional Completion:</strong> The works are to be carried out and completed in sections, each with its own Date of Possession, Completion Date, liquidated damages rate, and Rectification Period.</Pg>
      <Pg><strong>Named Specialists:</strong> Provisions are required to cover named specialists carrying out particular elements of the work (Supplemental Provision 6).</Pg>
      <Pg><strong>Private and Public Sector:</strong> The contract is suitable for both private employers and local or public authority employers. Additional supplemental provisions apply where the Employer is subject to the Public Contracts Regulations 2015.</Pg>

      <H3>When NOT to Use the SBC/Q</H3>
      <Pg>The SBC/Q is not the most appropriate contract if:</Pg>
      <Pg>• The Employer wants the <strong>Contractor to take overall design responsibility</strong> — use the JCT Design and Build Contract (DB 2024) instead.</Pg>
      <Pg>• The works are <strong>smaller or less complex</strong> and do not require the full range of SBC/Q provisions — consider the JCT Intermediate Building Contract (IC 2024) or Minor Works Building Contract (MW 2024).</Pg>
      <Pg>• The Employer wants a <strong>management contracting</strong> arrangement — use the JCT Management Building Contract (MC 2024).</Pg>
      <Pg>• The works are to be procured through a <strong>construction management</strong> arrangement — use the JCT Construction Management Agreement (CM/A 2024).</Pg>

      <H3>Example</H3>
      <Pg>A hospital trust commissions a new outpatient clinic. The trust's architect has produced detailed drawings and a Quantity Surveyor has prepared full bills of quantities. However, the trust wants the specialist medical gas installation to be designed by the installing contractor. This project is ideal for the SBC/Q with a Contractor's Designed Portion — the bulk of the design is provided by the Employer, but the medical gas element is delegated to the Contractor through the Employer's Requirements and Contractor's Proposals mechanism.</Pg>

      <Tip icon="⚠️" title="SBC/Q vs Design and Build — The Key Difference" accent={P.gold} bg={P.goldPale}>
        In the SBC/Q, the Employer provides the design and the Contractor constructs it. In the DB 2024, the Contractor takes responsibility for both design and construction in response to the Employer's Requirements. The contract administrator role also differs: in the SBC/Q, an independent Architect/Contract Administrator and Quantity Surveyor administer the contract; in the DB 2024, the Employer (or an Employer's Agent) administers it directly.
      </Tip>

      <H3>Test Yourself</H3>
      <SortExercise title="📋 Sort: SBC/Q criteria vs non-criteria" instruction="Drag the genuine SBC/Q criteria to the top (first 4) and items that are NOT criteria to the bottom." items={["Employer provides drawings and bills of quantities", "Architect/Contract Administrator and Quantity Surveyor appointed", "Works are larger and require detailed provisions", "Design prepared by or on behalf of the Employer", "Contractor takes overall design responsibility", "Works are small enough for a simple contract form", "No professional consultants are appointed", "Employer wants a management contracting arrangement"]} correctOrder={["Employer provides drawings and bills of quantities", "Architect/Contract Administrator and Quantity Surveyor appointed", "Works are larger and require detailed provisions", "Design prepared by or on behalf of the Employer", "Contractor takes overall design responsibility", "Works are small enough for a simple contract form", "No professional consultants are appointed", "Employer wants a management contracting arrangement"]} />
    </>);

    case "key-roles": return (<>
      <Title>Key Roles and Parties</Title><Sub>Articles 1–7</Sub>

      <H3>The Principle</H3>
      <Pg>The SBC/Q requires specific professional roles to be in place. These are named in the Articles of Agreement and their functions are defined throughout the Conditions. Understanding who does what is essential to administering the contract correctly.</Pg>

      <H3>The Employer</H3>
      <Pg>The person or organisation commissioning the works. The Employer provides the design (through its consultants), enters into the contract with the Contractor, and is responsible for making payments as certified. The Employer can be a private individual, a company, or a local or public authority. The Employer's primary obligation is stated in Article 2: to pay the Contractor the Contract Sum (or such other sum as becomes payable) at the times and in the manner specified in the Conditions.</Pg>

      <H3>The Contractor</H3>
      <Pg>The person or firm engaged to carry out and complete the works. The Contractor's principal obligation under Article 1 is to carry out the works in accordance with the Contract Documents. Under Clause 2.1, this means carrying out the works in a proper and workmanlike manner, in compliance with the Contract Documents, Statutory Requirements (including development control requirements, building regulations, and health and safety legislation), and the Construction Design and Management (CDM) Regulations. The Contractor must maintain competent management on site in the form of a Site Manager or deputy (Clause 3.2).</Pg>

      <H3>The Architect/Contract Administrator</H3>
      <Pg>Named in Article 4, this role is central to the administration of the SBC/Q. The Architect/Contract Administrator issues instructions (including variations under Clause 3.14), certifies interim and final payments, issues certificates of Practical Completion and Making Good, and grants extensions of time. The Architect/Contract Administrator acts as an <strong>independent certifier</strong> — they are appointed by the Employer but must act fairly and impartially when certifying. The JCT considers that the Architect/Contract Administrator should not be appointed as the Employer's representative given the potential conflict between that role and their obligation to act in a fair and professional manner (Guide, paragraph 79).</Pg>

      <H3>The Quantity Surveyor</H3>
      <Pg>Named in Article 5, the Quantity Surveyor carries out interim valuations (Clause 4.9.2), values variations under the Valuation Rules (Section 5), and prepares the final adjustment of the Contract Sum (Clause 4.25). They work alongside the Architect/Contract Administrator in the payment certification process. The Contractor may submit Payment Applications to the Quantity Surveyor (Clause 4.10.1).</Pg>

      <H3>Principal Designer and Principal Contractor</H3>
      <Pg>Named in Articles 6 and 7, these roles relate to statutory duties. Article 6 deals with appointments under the CDM Regulations 2015. Article 7, newly introduced in 2024, deals with appointments under Part 2A of the Building Regulations (introduced by the Building Safety Act 2022), which sets out safety duties and competence requirements for those involved in building work. The Building Regulations provide that the CDM principal designer and principal contractor may be treated as appointed for Building Regulations purposes as well (Part 2A, regulation 11D(2)). Professional advice should be sought on whether this is appropriate for any given project.</Pg>

      <H3>Example</H3>
      <Pg>On a £6 million office refurbishment, the Employer (a property company) appoints Smith Architects as the Architect/Contract Administrator (Article 4) and Jones & Partners as the Quantity Surveyor (Article 5). The Architect/Contract Administrator issues all instructions during construction and certifies each interim payment. The Quantity Surveyor values the work each month and prepares the valuation that forms the basis of the certificate. If the Employer's Finance Director pressures the Architect/Contract Administrator to reduce a certificate to manage cash flow, the Architect/Contract Administrator must refuse — their duty is to certify the sum genuinely considered due, not to manage the Employer's finances.</Pg>

      <H3>Test Yourself</H3>
      <SortExercise title="🏗️ Match the role to the Article" instruction="Drag these into the correct order matching Articles 1 through 7." items={["Article 1 — Contractor's obligations", "Article 2 — Contract Sum (Employer pays)", "Article 3 — Collaborative working", "Article 4 — Architect/Contract Administrator", "Article 5 — Quantity Surveyor", "Article 6 — CDM Principal Designer and Principal Contractor", "Article 7 — Building Regulations Principal Designer and Principal Contractor"]} correctOrder={["Article 1 — Contractor's obligations", "Article 2 — Contract Sum (Employer pays)", "Article 3 — Collaborative working", "Article 4 — Architect/Contract Administrator", "Article 5 — Quantity Surveyor", "Article 6 — CDM Principal Designer and Principal Contractor", "Article 7 — Building Regulations Principal Designer and Principal Contractor"]} />
      <PredictReveal question="The Architect/Contract Administrator is appointed by the Employer. Does this mean they act as the Employer's agent in all matters?" options={["Yes — they represent the Employer in all contractual matters", "No — they must act as an independent certifier when issuing certificates, even though appointed by the Employer", "They only act independently when the Contractor requests it"]} correctIdx={1} explanation="Correct. Although appointed by the Employer, the Architect/Contract Administrator must act fairly and impartially when certifying. The JCT Guide (paragraph 79) expressly states that the Architect/Contract Administrator should not be appointed as the Employer's representative given the conflict of interest. When certifying payment, they must state the sum they genuinely consider due — not the sum the Employer wants to pay." />
    </>);

    case "structure": return (<>
      <Title>Contract Structure</Title><Sub>Agreement, Conditions, and Schedules</Sub>

      <H3>The Principle</H3>
      <Pg>The SBC/Q 2024 is divided into two main parts — the <strong>Agreement</strong> and the <strong>Conditions</strong> — supplemented by seven Schedules. Understanding this structure helps you navigate the contract efficiently and know where to find specific provisions.</Pg>

      <H3>The Agreement</H3>
      <Pg>The Agreement is the front end of the contract and comprises four components:</Pg>
      <Pg><strong>Recitals:</strong> These describe the nature of the works, identify the drawings and bills of quantities, and record background facts such as the parties' Construction Industry Scheme (CIS) status and whether a Contractor's Designed Portion (CDP) applies. The Recitals are factual statements — not operative provisions. The First Recital records that the Employer wishes to have the works carried out and has had drawings and bills of quantities prepared. If there is a CDP, Recitals 9–12 apply, identifying the Employer's Requirements, the Contractor's Proposals, and the CDP Analysis.</Pg>
      <Pg><strong>Articles:</strong> These set out the primary obligations. Article 1 states the Contractor's obligation to carry out the works in accordance with the Contract Documents. Article 2 states the Employer's obligation to pay the Contract Sum. Article 3 (new in 2024, moved from the Supplemental Provisions) deals with collaborative working. Articles 4 and 5 name the Architect/Contract Administrator and Quantity Surveyor. Articles 6 and 7 deal with CDM and Building Regulations appointments. Articles 8–10 establish the dispute resolution mechanisms (adjudication, arbitration, and legal proceedings).</Pg>
      <Pg><strong>Contract Particulars:</strong> These are the project-specific entries that make each SBC/Q unique. They include the Base Date, Date of Possession, Completion Date, liquidated damages rates, Rectification Period, Retention Percentage, Fluctuations Provision selection, the first Interim Valuation Date, and many other bespoke details. Getting the Contract Particulars right is critical — an incomplete or incorrect entry can create significant problems during the contract.</Pg>
      <Pg><strong>Attestation:</strong> The execution clause. The contract may be executed under hand (6-year limitation period) or as a deed (12-year limitation period). The 2024 edition expressly confirms that electronic signatures are accepted by law, reflecting the Law Commission's 2019 report on electronic execution of documents.</Pg>

      <H3>The Conditions (Sections 1–9)</H3>
      <Pg>The operative provisions are organised into nine sections:</Pg>
      <Pg><strong>Section 1</strong> — Definitions and Interpretation: all capitalised terms, priority of documents, notices.</Pg>
      <Pg><strong>Section 2</strong> — Carrying out the Works: Contractor's obligations, possession, Contractor's Designed Portion (CDP), extensions of time, Practical Completion, defects.</Pg>
      <Pg><strong>Section 3</strong> — Control of the Works: site management, sub-contracting, Architect/Contract Administrator's instructions, variations, CDM and Building Regulations.</Pg>
      <Pg><strong>Section 4</strong> — Payment: Contract Sum, interim certificates, retention, loss and expense, Final Certificate (covered in detail in Module 6).</Pg>
      <Pg><strong>Section 5</strong> — Variations: definition, Valuation Rules, quotation procedures.</Pg>
      <Pg><strong>Section 6</strong> — Injury, Damage and Insurance: liability, Works insurance options, Professional Indemnity insurance, Joint Fire Code.</Pg>
      <Pg><strong>Section 7</strong> — Assignment, Third Party Rights and Performance Bonds.</Pg>
      <Pg><strong>Section 8</strong> — Termination: grounds and consequences for both parties.</Pg>
      <Pg><strong>Section 9</strong> — Settlement of Disputes: notification, mediation, adjudication, arbitration.</Pg>

      <H3>The Schedules</H3>
      <Pg>Seven Schedules supplement the Conditions: Schedule 1 (Design Submission Procedure), Schedule 2 (Variation and Acceleration Quotation Procedures), Schedule 3 (Insurance Options), Schedule 4 (Code of Practice for opening up works), Schedule 5 (Third Party Rights), Schedule 6 (Forms of Bonds — Advance Payment, Listed Items, and Retention), and Schedule 7 (Supplemental Provisions).</Pg>

      <Tip icon="💡" title="Under Hand vs As a Deed">The choice of execution method has significant practical consequences. Execution under hand gives a 6-year limitation period for claims; execution as a deed gives 12 years. Most commercial building contracts are executed as deeds. The 2024 edition expressly confirms that electronic signatures are valid — parties no longer need to question whether a digitally signed contract is enforceable.</Tip>

      <H3>Test Yourself</H3>
      <SortExercise title="📑 Put the Agreement components in order" instruction="Drag these into the correct sequence as they appear in the contract." items={["Recitals", "Articles", "Contract Particulars", "Attestation"]} correctOrder={["Recitals", "Articles", "Contract Particulars", "Attestation"]} />
      <PredictReveal question="Where was the collaborative working provision located in the previous edition of the SBC?" options={["In Section 2 of the Conditions", "In the Supplemental Provisions — it has been moved to Article 3 in the 2024 edition", "It was not included in the previous edition"]} correctIdx={1} explanation="Correct. Collaborative working was previously in the Supplemental Provisions but has been moved to Article 3 in the 2024 edition, reflecting its growing importance in project delivery. It now reads: 'The Parties shall work with each other and with other project team members in a co-operative and collaborative manner, in good faith and in a spirit of trust and respect.'" />
    </>);

    default: return null;
  }
}

// ─── SIMULATOR: CONTRACT SELECTION ──────────────────────────────────
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

function Simulator() {
  const [states, setStates] = useState({});
  const totalPts = Object.values(states).reduce((a, s) => a + (s?.points || 0), 0);
  const answered = Object.values(states).filter(s => s?.answered).length;

  function handleChoice(briefId, optIdx) {
    const brief = SIM_BRIEFS.find(b => b.id === briefId);
    const opt = brief.options[optIdx];
    setStates(prev => ({ ...prev, [briefId]: { answered: true, selected: optIdx, correct: !!opt.correct, points: opt.points, message: opt.feedback } }));
  }

  return (
    <div style={{ background: S.bg, borderRadius: 16, padding: "28px 24px", margin: "-24px -28px", minHeight: "80vh" }}>
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
              <div style={{ padding: "18px 20px" }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: S.pri }}>{b.brief}</p>
              </div>
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
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────────────
function Sidebar({ current, setCurrent }) {
  return (
    <nav style={{ width: 240, minHeight: "100%", background: P.navy, padding: "24px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${P.navyLight}` }}>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, color: P.gold, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Module 1</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, color: P.white, lineHeight: 1.3 }}>Introduction</div>
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
export default function Module1() {
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
