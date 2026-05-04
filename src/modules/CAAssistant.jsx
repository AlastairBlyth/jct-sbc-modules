import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   JCT SBC/Q 2024 — Contract Administrator Assistant
   
   A practical tool for Architects/Contract Administrators administering
   the SBC/Q 2024. Five tools: Instruction Drafter, EOT Decision Helper,
   Practical Completion Assessor, Certification Tracker, and Situation
   Advisor (AI).
   ═══════════════════════════════════════════════════════════════════════ */

const P = { navy: "#0f2a44", navyLight: "#1a3d5c", teal: "#1a8a7d", tealLight: "#2bb5a4", tealPale: "#e8f6f4", gold: "#d4a843", goldPale: "#fdf6e3", cream: "#faf8f5", white: "#ffffff", text: "#1e2a3a", textMid: "#4a5c6e", textLight: "#7a8c9e", border: "#dde3ea", shadow: "0 2px 16px rgba(15,42,68,0.07)" };
const A = { bg: "#0d1f35", card: "#142a45", cardHover: "#1a3458", accent: "#e8a838", teal: "#2ec4a8", pri: "#e8ecf1", sec: "#8fa3ba", dim: "#5a7190", bdr: "#1e3a5f", userBg: "#1a5276", aiBg: "#1a3a52" };

// ─── DATE UTILITIES ─────────────────────────────────────────────────
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function addWeeks(d, n) { return addDays(d, n * 7); }
function addMonths(d, n) { const r = new Date(d); r.setMonth(r.getMonth() + n); return r; }
function fmt(d) { if (!d) return "—"; return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); }
function fmtShort(d) { if (!d) return "—"; return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
function parseDate(s) { if (!s) return null; const d = new Date(s + "T00:00:00"); return isNaN(d.getTime()) ? null : d; }
function daysBetween(a, b) { return Math.round((b - a) / 86400000); }

// ─── SYSTEM PROMPT FOR AI ADVISOR ───────────────────────────────────
const SYSTEM_PROMPT = `You are a JCT SBC/Q 2024 Contract Administration Assistant — an expert in the role and duties of the Architect/Contract Administrator under the JCT Standard Building Contract With Quantities 2024.

Your role is to help Architects/Contract Administrators navigate real-world contract administration situations under the SBC/Q 2024.

THE CA's DUAL ROLE:
- Appointed in Article 4 — a personal appointment, material to the Contractor's decision to enter the contract
- When instructing: acts broadly on behalf of the Employer (variations, opening up, postponement)
- When certifying: must act as an INDEPENDENT professional — honest opinion regardless of Employer's wishes
- The JCT Guide (para 79) warns the CA should NOT be appointed as Employer's representative (Cl. 3.3) due to conflict
- Replacement: Cl. 3.5 requires "consent not to be unreasonably delayed or withheld"; successor cannot override predecessor's certificates (Cl. 3.5.2)

INSTRUCTIONS (Cl. 3.10–3.22):
- Contractor must comply forthwith with all CA instructions empowered by the Conditions (Cl. 3.10)
- All instructions must be in writing; oral instructions confirmed under Cl. 3.12 (7-day confirmation mechanism)
- Four exceptions to immediate compliance: (1) variations affecting access/working (Cl. 3.10.1 — reasonable objection); (2) instructions injurious to CDP/CDM/Building Regs (Cl. 3.10.3); (3) patent rights (Cl. 3.10.4); (4) Named Specialists (Cl. 3.10.5)
- Non-compliance: 7 days' written notice under Cl. 3.11, then Employer may engage others
- Ultra vires instructions: an instruction outside the CA's contractual powers need not be obeyed

KEY CA INSTRUCTIONS:
- Variations (Cl. 3.14): alteration of design/quality/quantity; access/working restrictions
- Opening up and testing (Cl. 3.17): cost borne by Contractor if work defective; by Employer if work compliant
- Removal of defective work (Cl. 3.18)
- Postponement (Cl. 3.15): must consider whether this constitutes a Relevant Event
- Expenditure of Provisional Sums (Cl. 3.16)

CERTIFICATES AND TIME LIMITS:
- Interim Certificates (Cl. 4.9): within 5 days of each due date (due date = IVD + 7 days)
- Practical Completion Certificate (Cl. 2.30): issued when works are complete for all practical purposes, free from patent defects (H W Nevill v William Press [1981])
- Non-Completion Certificate (Cl. 2.31): if Contractor fails to achieve PC by Completion Date; prerequisite for LDs
- Certificate of Making Good (Cl. 2.39): after Rectification Period, triggers final retention release
- Final Certificate (Cl. 4.26): within 2 months of latest trigger

EXTENSIONS OF TIME (Cl. 2.26–2.29):
- CA has a DUTY (not discretion) to consider EOT when Relevant Event notified (Merton v Leach [1985])
- Decision within 8 weeks of receiving Contractor's particulars (reduced from 12 in 2024)
- Failure to grant proper EOT: TIME SET AT LARGE, Employer loses LD rights
- Relevant Events (Cl. 2.29): variations, information delays, force majeure, specified perils, civil commotion, strikes, epidemics, statutory changes, antiquities/contamination, and more
- Relevant Events that are Employer's risk vs neutral events vs Contractor's risk

LOSS AND EXPENSE (Cl. 4.20–4.24):
- Relevant Matters (Cl. 4.22) — distinct from Relevant Events
- CA's initial response: 28 days; subsequent updates: 14 days
- Weather is a Relevant Event (time) but NOT a Relevant Matter (no money)

LIQUIDATED DAMAGES (Cl. 2.31–2.32):
- Three prerequisites: (1) Non-Completion Certificate; (2) Employer's advance notice (Cl. 2.32.1.2); (3) Pay Less Notice
- If EOT granted after NCC issued: NCC cancelled, LDs repaid for extension period, new NCC required
- Triple Point v PTT [2021]: LDs apply only to termination date; codified in Cl. 2.32.5

KEY CASE LAW:
- Sutcliffe v Thackrah [1974]: CA must certify independently; liable for negligent over-certification
- Panamena v Leyland [1947]: Employer interference with certification makes certificate unreliable
- London Borough of Merton v Stanley Hugh Leach [1985]: CA has implied duty to exercise EOT power; failure sets time at large
- H W Nevill (Sunblest) v William Press [1981]: Practical completion means complete for all practical purposes, free from patent defects
- Glenlion Construction v The Guinness Trust [1987]: CA can take defects into account when certifying PC
- Yorkshire Water v Sun Alliance [1997]: CA cannot certify own work as satisfactory where conflict exists

RESPONSE GUIDELINES:
- Always cite the specific clause number when referring to a contractual provision
- Identify the relevant deadlines and calculate them from the user's dates where possible
- Distinguish clearly between Relevant Events (time — Cl. 2.29) and Relevant Matters (money — Cl. 4.22)
- Flag common traps: failing to grant proper EOTs, issuing ultra vires instructions, not following the LD prerequisites
- When drafting instructions or notices, include the minimum content required by the relevant clause
- Be direct and practical — the user is dealing with a real situation
- Keep responses concise but thorough — aim for 150-300 words unless the question requires more detail
- Use paragraph form, not bullet points, unless listing specific items or steps`;

// ─── TOOLS CONFIG ───────────────────────────────────────────────────
const TOOLS = [
  { id: "instructions", icon: "📝", title: "Instruction Drafter", desc: "Draft CA instructions under the SBC/Q 2024" },
  { id: "eot", icon: "⏱️", title: "EOT Decision Helper", desc: "Assess extension of time applications" },
  { id: "pc", icon: "✅", title: "PC Assessor", desc: "Assess readiness for Practical Completion" },
  { id: "certs", icon: "📜", title: "Certification Tracker", desc: "Track all certificates and their deadlines" },
  { id: "advisor", icon: "💬", title: "Situation Advisor", desc: "AI-powered contract administration advice" },
];

// ─── SHARED UI COMPONENTS ───────────────────────────────────────────
function InputField({ label, hint, type = "text", value, onChange, placeholder, style: sx }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 4 }}>
        {label} {hint && <span style={{ color: A.dim }}>({hint})</span>}
      </span>
      {type === "textarea" ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, boxSizing: "border-box", ...sx }} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder || ""}
          style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14, boxSizing: "border-box", ...sx }} />
      )}
    </label>
  );
}

function PrimaryBtn({ onClick, disabled, children, style: sx }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: disabled ? A.dim : `linear-gradient(135deg, ${P.teal}, ${P.tealLight})`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap", ...sx }}>
      {children}
    </button>
  );
}

function ToolHeader({ icon, title, subtitle }) {
  return (
    <>
      <div style={{ fontSize: 20, fontWeight: 700, color: A.pri, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
        <span>{icon}</span> {title}
      </div>
      <div style={{ fontSize: 13, color: A.sec, marginBottom: 24, lineHeight: 1.6 }}>{subtitle}</div>
    </>
  );
}

function TimelineStep({ label, date, note, color, isLast }) {
  return (
    <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
      <div style={{ width: 44, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: color, border: `3px solid ${A.bg}`, zIndex: 1, boxShadow: `0 0 0 1px ${color}44` }} />
        {!isLast && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${color}66, ${A.bdr})` }} />}
      </div>
      <div style={{ flex: 1, padding: "0 0 20px", minHeight: 52 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color }}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: A.pri, fontVariantNumeric: "tabular-nums" }}>{typeof date === "string" ? date : fmt(date)}</div>
        </div>
        <div style={{ fontSize: 12, color: A.sec, marginTop: 4, lineHeight: 1.5 }}>{note}</div>
      </div>
    </div>
  );
}

function WarningBox({ title, children, color = "#f87171" }) {
  return (
    <div style={{ background: `${color}0a`, border: `1px solid ${color}33`, borderRadius: 10, padding: "14px 18px", marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: A.sec, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function InfoBox({ title, children, color = A.teal }) {
  return (
    <div style={{ background: `${color}0a`, border: `1px solid ${color}33`, borderRadius: 10, padding: "14px 18px", marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: A.sec, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

// ─── INSTRUCTION DRAFTER ────────────────────────────────────────────
const INSTRUCTION_TYPES = [
  { id: "variation", title: "Variation Instruction", clause: "Cl. 3.14", desc: "Alter design, quality, quantity of the Works, or impose access/working restrictions" },
  { id: "opening-up", title: "Opening Up / Testing", clause: "Cl. 3.17", desc: "Require opening up for inspection or testing of work or materials" },
  { id: "removal", title: "Removal of Defective Work", clause: "Cl. 3.18", desc: "Require removal and re-execution of work not in accordance with the Contract" },
  { id: "postponement", title: "Postponement", clause: "Cl. 3.15", desc: "Postpone any work to be executed under the Contract" },
  { id: "provisional-sum", title: "Expenditure of Provisional Sum", clause: "Cl. 3.16", desc: "Instruct on the expenditure of a Provisional Sum in the Contract Bills" },
  { id: "non-compliance", title: "Non-Compliance Notice", clause: "Cl. 3.11", desc: "7-day notice requiring compliance with a previous instruction" },
];

function InstructionDrafter() {
  const [selected, setSelected] = useState(null);
  const [fields, setFields] = useState({});
  const [copied, setCopied] = useState(false);
  const set = (k, v) => setFields(prev => ({ ...prev, [k]: v }));

  const templates = {
    variation: {
      fields: [
        { k: "project", l: "Project name" }, { k: "refNo", l: "Instruction reference number" },
        { k: "description", l: "Description of the variation", type: "textarea" },
        { k: "drawingRefs", l: "Drawing / specification references (if any)" },
        { k: "vqRequired", l: "Variation Quotation required?", type: "select", options: ["No — value under Valuation Rules", "Yes — Contractor to provide quotation under Schedule 2"] },
      ],
      generate: (f) => `ARCHITECT/CONTRACT ADMINISTRATOR'S INSTRUCTION
Under Clause 3.14 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Instruction No: ${f.refNo || "[Ref]"}
Date: ${new Date().toLocaleDateString("en-GB")}

You are hereby instructed as follows:

VARIATION:
${f.description || "[Describe the alteration to design, quality, quantity, or the imposition/alteration/removal of obligations or restrictions regarding access, working space, working hours, or order of working]"}

${f.drawingRefs ? `Reference drawings/specifications: ${f.drawingRefs}` : ""}
${f.vqRequired === "Yes — Contractor to provide quotation under Schedule 2" ?
`This instruction is subject to the Variation Quotation procedure (Schedule 2). The Contractor is requested to submit a Variation Quotation within 21 days of this instruction (Cl. 5.3.1). If the Contractor does not wish to provide a quotation, written notice must be given within 7 days (Cl. 5.3.1).` :
`This Variation is to be valued by the Quantity Surveyor in accordance with the Valuation Rules (Clauses 5.6–5.10).`}

This instruction is issued under Clause 3.14 of the Conditions and the Contractor is required to comply forthwith (Clause 3.10).

NOTE: If this instruction imposes or alters obligations or restrictions relating to access, working space, working hours or order of working, the Contractor may make reasonable objection in writing (Cl. 3.10.1).`
    },
    "opening-up": {
      fields: [
        { k: "project", l: "Project name" }, { k: "refNo", l: "Instruction reference number" },
        { k: "location", l: "Location of work to be opened up / tested" },
        { k: "description", l: "Description of inspection or test required", type: "textarea" },
      ],
      generate: (f) => `ARCHITECT/CONTRACT ADMINISTRATOR'S INSTRUCTION
Under Clause 3.17 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Instruction No: ${f.refNo || "[Ref]"}
Date: ${new Date().toLocaleDateString("en-GB")}

You are hereby instructed as follows:

OPENING UP / TESTING:
Location: ${f.location || "[Describe location]"}

${f.description || "[Describe the inspection or test required — e.g. open up concrete pour at grid ref B3 to inspect reinforcement placement and concrete cover]"}

This instruction is issued under Clause 3.17 of the Conditions.

COST NOTE: If the work, materials or goods are found to be in accordance with the Contract, the cost of opening up, testing and making good shall be added to the Contract Sum. If the work is found to be defective or not in accordance with the Contract, the cost is borne by the Contractor.

The Contractor is required to comply forthwith (Clause 3.10).`
    },
    removal: {
      fields: [
        { k: "project", l: "Project name" }, { k: "refNo", l: "Instruction reference number" },
        { k: "location", l: "Location of defective work" },
        { k: "defect", l: "Description of defect / non-compliance", type: "textarea" },
        { k: "requirement", l: "Contract requirement not met (clause/spec reference)" },
      ],
      generate: (f) => `ARCHITECT/CONTRACT ADMINISTRATOR'S INSTRUCTION
Under Clause 3.18 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Instruction No: ${f.refNo || "[Ref]"}
Date: ${new Date().toLocaleDateString("en-GB")}

You are hereby instructed as follows:

REMOVAL OF WORK NOT IN ACCORDANCE WITH THE CONTRACT:
Location: ${f.location || "[Describe location]"}

The following work/materials have been found not to be in accordance with the Contract:

${f.defect || "[Describe the defect or non-compliance — e.g. blockwork mortar joints not properly filled, plasterboard fixing centres exceed specification]"}

Contract requirement: ${f.requirement || "[Reference the specific clause, specification section, or drawing that has not been met]"}

You are required to remove the above work from the site and re-execute it in accordance with the Contract Documents.

This instruction is issued under Clause 3.18.1 of the Conditions and the Contractor is required to comply forthwith (Clause 3.10). No extension of time shall be granted and no addition to the Contract Sum shall be made in respect of compliance with this instruction.

NOTE: If compliance is not achieved within 7 days of a written notice under Clause 3.11, the Employer may engage others to carry out the work and may deduct the cost from sums due to the Contractor.`
    },
    postponement: {
      fields: [
        { k: "project", l: "Project name" }, { k: "refNo", l: "Instruction reference number" },
        { k: "workDesc", l: "Description of work to be postponed", type: "textarea" },
        { k: "reason", l: "Reason for postponement" },
      ],
      generate: (f) => `ARCHITECT/CONTRACT ADMINISTRATOR'S INSTRUCTION
Under Clause 3.15 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Instruction No: ${f.refNo || "[Ref]"}
Date: ${new Date().toLocaleDateString("en-GB")}

You are hereby instructed as follows:

POSTPONEMENT:
The following work is to be postponed until further notice:

${f.workDesc || "[Describe the work to be postponed]"}

${f.reason ? `Reason: ${f.reason}` : ""}

This instruction is issued under Clause 3.15 of the Conditions and the Contractor is required to comply forthwith (Clause 3.10).

IMPORTANT NOTES:
— Postponement is a Relevant Event under Clause 2.29.3 — the Contractor may be entitled to an extension of time.
— Postponement may also give rise to a claim for loss and expense under Clause 4.22 (Relevant Matter).
— The CA should consider the programme impact and notify the Contractor of any revised sequencing requirements.`
    },
    "provisional-sum": {
      fields: [
        { k: "project", l: "Project name" }, { k: "refNo", l: "Instruction reference number" },
        { k: "psRef", l: "Provisional Sum reference (item/page in Contract Bills)" },
        { k: "description", l: "Work to be carried out against the Provisional Sum", type: "textarea" },
      ],
      generate: (f) => `ARCHITECT/CONTRACT ADMINISTRATOR'S INSTRUCTION
Under Clause 3.16 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Instruction No: ${f.refNo || "[Ref]"}
Date: ${new Date().toLocaleDateString("en-GB")}

You are hereby instructed as follows:

EXPENDITURE OF PROVISIONAL SUM:
Provisional Sum reference: ${f.psRef || "[Contract Bills item/page reference]"}

The following work is to be carried out against the above Provisional Sum:

${f.description || "[Describe the work to be executed, including any specification or drawing references]"}

This instruction is issued under Clause 3.16 of the Conditions. The work will be valued in accordance with the Valuation Rules (Clauses 5.6–5.10).

The Contractor is required to comply forthwith (Clause 3.10).`
    },
    "non-compliance": {
      fields: [
        { k: "project", l: "Project name" }, { k: "refNo", l: "Notice reference number" },
        { k: "originalRef", l: "Original instruction reference" },
        { k: "originalDate", l: "Date of original instruction", type: "date" },
        { k: "description", l: "Instruction not complied with", type: "textarea" },
      ],
      generate: (f) => `NOTICE REQUIRING COMPLIANCE WITH INSTRUCTION
Under Clause 3.11 of the JCT SBC/Q 2024

Project: ${f.project || "[Project name]"}
Notice No: ${f.refNo || "[Ref]"}
Date: ${new Date().toLocaleDateString("en-GB")}

We refer to our Instruction No. ${f.originalRef || "[Ref]"} dated ${f.originalDate ? fmtShort(parseDate(f.originalDate)) : "[Date]"}, which required:

${f.description || "[Describe the instruction that has not been complied with]"}

We note that you have not complied with the above instruction.

This notice is issued under Clause 3.11 of the Conditions. If you do not begin to comply with the above instruction within 7 days of the date of this notice, the Employer may employ and pay other persons to execute the work, and all costs incurred may be deducted from sums due or to become due to you, or may be recovered as a debt.

We urge immediate compliance.`
    },
  };

  function copyToClipboard() {
    if (!selected || !templates[selected]) return;
    navigator.clipboard.writeText(templates[selected].generate(fields)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div>
      <ToolHeader icon="📝" title="Instruction Drafter" subtitle="Select an instruction type and enter your project details. The drafter generates a properly formatted CA instruction citing the correct contractual powers." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
        {INSTRUCTION_TYPES.map(n => (
          <button key={n.id} onClick={() => { setSelected(n.id); setFields({}); setCopied(false); }}
            style={{ padding: "14px 16px", borderRadius: 10, border: `2px solid ${selected === n.id ? A.teal : A.bdr}`, background: selected === n.id ? "rgba(46,196,168,0.08)" : "rgba(0,0,0,0.1)", textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: selected === n.id ? A.teal : A.pri }}>{n.title}</div>
            <div style={{ fontSize: 11, color: A.dim, marginTop: 3 }}>{n.clause}</div>
            <div style={{ fontSize: 12, color: A.sec, marginTop: 5, lineHeight: 1.5 }}>{n.desc}</div>
          </button>
        ))}
      </div>

      {selected && templates[selected] && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {templates[selected].fields.map(f => {
              if (f.type === "textarea") return (
                <div key={f.k} style={{ gridColumn: "1 / -1" }}>
                  <InputField label={f.l} type="textarea" value={fields[f.k] || ""} onChange={e => set(f.k, e.target.value)} />
                </div>
              );
              if (f.type === "select") return (
                <label key={f.k} style={{ display: "block" }}>
                  <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 4 }}>{f.l}</span>
                  <select value={fields[f.k] || f.options[0]} onChange={e => set(f.k, e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14 }}>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              );
              return <InputField key={f.k} label={f.l} type={f.type || "text"} value={fields[f.k] || ""} onChange={e => set(f.k, e.target.value)} />;
            })}
          </div>

          <div style={{ position: "relative" }}>
            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 10, padding: "24px 28px", fontFamily: "'Courier New', Consolas, monospace", fontSize: 13, color: A.pri, lineHeight: 1.85, whiteSpace: "pre-wrap", border: `1px solid ${A.bdr}` }}>
              {templates[selected].generate(fields)}
            </div>
            <button onClick={copyToClipboard}
              style={{ position: "absolute", top: 10, right: 10, padding: "6px 14px", borderRadius: 6, border: `1px solid ${A.bdr}`, background: copied ? "rgba(46,196,168,0.2)" : "rgba(0,0,0,0.3)", color: copied ? A.teal : A.sec, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          <div style={{ fontSize: 12, color: A.dim, marginTop: 10, fontStyle: "italic", lineHeight: 1.6 }}>
            This is a template based on the contractual requirements. Review and adapt it to your specific circumstances before issuing. This is not legal advice.
          </div>
        </>
      )}
    </div>
  );
}

// ─── EOT DECISION HELPER ────────────────────────────────────────────
const RELEVANT_EVENTS = [
  { id: "variations", label: "Variations (Cl. 2.29.1)", riskOwner: "Employer", isRelevantMatter: true },
  { id: "info-delay", label: "Late information / instructions (Cl. 2.29.2)", riskOwner: "Employer", isRelevantMatter: true },
  { id: "postponement", label: "Postponement instruction (Cl. 2.29.3)", riskOwner: "Employer", isRelevantMatter: true },
  { id: "opening-up", label: "Opening up — work found compliant (Cl. 2.29.4)", riskOwner: "Employer", isRelevantMatter: true },
  { id: "named-specialist", label: "Named Specialist delay (Cl. 2.29.5)", riskOwner: "Employer", isRelevantMatter: true },
  { id: "employer-work", label: "Employer's persons / failure to give access (Cl. 2.29.6)", riskOwner: "Employer", isRelevantMatter: true },
  { id: "cdm-regs", label: "CDM / Building Regulations compliance (Cl. 2.29.7)", riskOwner: "Employer", isRelevantMatter: true },
  { id: "statutory-change", label: "Change in Statutory Requirements (Cl. 2.29.8)", riskOwner: "Neutral", isRelevantMatter: false },
  { id: "force-majeure", label: "Force majeure (Cl. 2.29.9)", riskOwner: "Neutral", isRelevantMatter: false },
  { id: "specified-perils", label: "Specified Perils (Cl. 2.29.10)", riskOwner: "Neutral", isRelevantMatter: false },
  { id: "civil-commotion", label: "Civil commotion / terrorism (Cl. 2.29.11)", riskOwner: "Neutral", isRelevantMatter: false },
  { id: "weather", label: "Exceptionally adverse weather (Cl. 2.29.12)", riskOwner: "Neutral", isRelevantMatter: false },
  { id: "strikes", label: "Strikes / lock-outs (Cl. 2.29.13)", riskOwner: "Neutral", isRelevantMatter: false },
  { id: "epidemics", label: "Epidemics (Cl. 2.29.14) — NEW in 2024", riskOwner: "Neutral", isRelevantMatter: false },
  { id: "antiquities", label: "Antiquities / contamination / UXO (Cl. 2.29.15) — NEW in 2024", riskOwner: "Neutral", isRelevantMatter: true },
  { id: "statutory-powers", label: "Exercise of statutory powers (Cl. 2.29.16)", riskOwner: "Neutral", isRelevantMatter: false },
];

function EOTHelper() {
  const [notifDate, setNotifDate] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [delayDays, setDelayDays] = useState("");
  const [currentCompDate, setCurrentCompDate] = useState("");
  const [result, setResult] = useState(null);

  function assess() {
    const notif = parseDate(notifDate);
    const compDate = parseDate(currentCompDate);
    if (!notif) return;

    const deadlineDate = addWeeks(notif, 8);
    const event = RELEVANT_EVENTS.find(e => e.id === selectedEvent);
    const extension = parseInt(delayDays) || 0;
    const newCompDate = compDate && extension ? addDays(compDate, extension) : null;

    setResult({ notif, deadlineDate, event, extension, currentCompDate: compDate, newCompDate });
  }

  return (
    <div>
      <ToolHeader icon="⏱️" title="EOT Decision Helper" subtitle="Assess an extension of time application. The helper identifies the Relevant Event, calculates your decision deadline (8 weeks under Cl. 2.28.1), and flags whether a Relevant Matter arises for loss and expense." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <InputField label="Date Contractor's particulars received" type="date" value={notifDate} onChange={e => setNotifDate(e.target.value)} />
        <InputField label="Current Completion Date" type="date" value={currentCompDate} onChange={e => setCurrentCompDate(e.target.value)} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: A.sec, display: "block", marginBottom: 8 }}>Relevant Event claimed (Cl. 2.29)</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
          {RELEVANT_EVENTS.map(e => (
            <button key={e.id} onClick={() => setSelectedEvent(e.id)}
              style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${selectedEvent === e.id ? A.teal : A.bdr}`, background: selectedEvent === e.id ? "rgba(46,196,168,0.08)" : "rgba(0,0,0,0.08)", textAlign: "left", cursor: "pointer", transition: "all 0.12s" }}>
              <div style={{ fontSize: 13, color: selectedEvent === e.id ? A.teal : A.pri, fontWeight: selectedEvent === e.id ? 600 : 400 }}>{e.label}</div>
              <div style={{ fontSize: 10, color: A.dim, marginTop: 3 }}>
                Risk: {e.riskOwner} {e.isRelevantMatter ? " · Also a Relevant Matter" : " · Time only (no money)"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "end", marginBottom: 24 }}>
        <div style={{ width: 200 }}>
          <InputField label="Fair and reasonable extension (days)" type="number" value={delayDays} onChange={e => setDelayDays(e.target.value)} placeholder="0" />
        </div>
        <PrimaryBtn onClick={assess} disabled={!notifDate || !selectedEvent}>Assess</PrimaryBtn>
      </div>

      {result && (
        <div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TimelineStep label="Particulars Received" date={result.notif} note="Start of 8-week decision period (Cl. 2.28.1)" color={A.dim} />
            <TimelineStep label="CA Decision Deadline" date={result.deadlineDate} note="8 weeks from receipt — CA must notify Contractor of decision (reduced from 12 weeks in 2024)" color="#f87171" />
            {result.currentCompDate && (
              <TimelineStep label="Current Completion Date" date={result.currentCompDate} note="As currently fixed" color={A.accent} />
            )}
            {result.newCompDate && (
              <TimelineStep label="Proposed New Completion Date" date={result.newCompDate} note={`Current + ${result.extension} days extension`} color={A.teal} isLast />
            )}
            {!result.newCompDate && <TimelineStep label="No Extension" date="N/A" note="If no extension is fair and reasonable, notify the Contractor with reasons" color={A.dim} isLast />}
          </div>

          {result.event && (
            <>
              <InfoBox title={`📋 ${result.event.label}`} color={result.event.riskOwner === "Employer" ? A.accent : A.teal}>
                <strong>Risk owner:</strong> {result.event.riskOwner}
                {result.event.riskOwner === "Employer" && " — This is an Employer-risk event. The Contractor is not at fault."}
                {result.event.riskOwner === "Neutral" && " — This is a neutral event. Neither party is at fault, but the Contractor is entitled to time."}
              </InfoBox>

              {result.event.isRelevantMatter ? (
                <InfoBox title="💰 Loss & Expense — Relevant Matter" color={A.accent}>
                  This Relevant Event is also a Relevant Matter under Cl. 4.22. If the Contractor has suffered or is likely to suffer direct loss and/or expense, the CA must ascertain or instruct the QS to ascertain the amount (Cl. 4.20). Initial response within 28 days; updates every 14 days (Cl. 4.21).
                </InfoBox>
              ) : (
                <InfoBox title="⏱️ Time Only — No Financial Entitlement" color={A.dim}>
                  This Relevant Event is NOT a Relevant Matter. The Contractor may be entitled to an extension of time but has no contractual entitlement to loss and expense under the SBC/Q 2024 for this event. {result.event.id === "weather" && "Weather is a classic example: it justifies more time, but the financial risk sits with the Contractor."}
                </InfoBox>
              )}
            </>
          )}

          <WarningBox title="⚠️ Consequences of Getting This Wrong">
            If the CA fails to grant a fair and reasonable extension when a Relevant Event has occurred, time may be set at large (Merton v Leach [1985]). The Employer would lose the right to liquidated damages, and the Contractor's obligation would be to complete within a "reasonable time" — far harder to enforce.
          </WarningBox>
        </div>
      )}
    </div>
  );
}

// ─── PRACTICAL COMPLETION ASSESSOR ──────────────────────────────────
const PC_CRITERIA = [
  { id: "works-complete", label: "Works substantially complete", desc: "All work described in Contract Documents executed to a reasonable standard", critical: true },
  { id: "no-patent-defects", label: "No patent defects preventing use", desc: "No defects that would prevent the building being used for its intended purpose (H W Nevill v William Press [1981])", critical: true },
  { id: "statutory-compliance", label: "Statutory requirements met", desc: "Building control sign-off, CDM file, H&S file obligations satisfied", critical: true },
  { id: "building-regs", label: "Building Regulations compliance", desc: "Completion certificate or equivalent obtained under Part 2A (new in 2024)", critical: true },
  { id: "as-built", label: "As-built drawings provided", desc: "Contractor has provided as-built drawings and O&M manuals as required", critical: false },
  { id: "testing", label: "Testing and commissioning complete", desc: "All M&E systems tested, commissioned and performing to specification", critical: true },
  { id: "external-works", label: "External works complete", desc: "Landscaping, drainage, car parks, boundary treatments substantially finished", critical: false },
  { id: "snagging-minor", label: "Outstanding items are truly minor", desc: "Only trifling defects remain — paint touch-ups, stiff handles, minor finishing items", critical: false },
  { id: "cdp-complete", label: "CDP work complete (if applicable)", desc: "Contractor's Designed Portion fully executed and tested", critical: true },
  { id: "access-usable", label: "Building can be occupied and used", desc: "The building is fit for its intended purpose — the key test for practical completion", critical: true },
];

function PCAssessor() {
  const [checks, setChecks] = useState({});
  const [notes, setNotes] = useState("");
  const [assessed, setAssessed] = useState(false);

  function toggle(id) { setChecks(prev => ({ ...prev, [id]: !prev[id] })); }

  function assess() { setAssessed(true); }

  const criticalFails = PC_CRITERIA.filter(c => c.critical && !checks[c.id]);
  const nonCriticalFails = PC_CRITERIA.filter(c => !c.critical && !checks[c.id]);
  const allCriticalPassed = criticalFails.length === 0;
  const allPassed = allCriticalPassed && nonCriticalFails.length === 0;

  return (
    <div>
      <ToolHeader icon="✅" title="Practical Completion Assessor" subtitle="Work through each criterion to assess whether Practical Completion can be certified under Cl. 2.30. The assessor distinguishes critical requirements from snagging items." />

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {PC_CRITERIA.map(c => (
          <button key={c.id} onClick={() => toggle(c.id)}
            style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px", borderRadius: 10, border: `1px solid ${checks[c.id] ? `${A.teal}55` : A.bdr}`, background: checks[c.id] ? "rgba(46,196,168,0.06)" : "rgba(0,0,0,0.08)", textAlign: "left", cursor: "pointer", transition: "all 0.12s" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${checks[c.id] ? A.teal : A.dim}`, background: checks[c.id] ? A.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.12s" }}>
              {checks[c.id] && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: checks[c.id] ? A.teal : A.pri }}>{c.label}</span>
                {c.critical && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "rgba(248,113,113,0.15)", color: "#f87171", fontWeight: 600 }}>CRITICAL</span>}
              </div>
              <div style={{ fontSize: 12, color: A.sec, marginTop: 3, lineHeight: 1.5 }}>{c.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <InputField label="Additional notes (defects observed, conditions, etc.)" type="textarea" value={notes} onChange={e => setNotes(e.target.value)} placeholder="E.g. Minor paint defects in stairwell B, one stiff fire door on level 2..." />
      </div>

      <PrimaryBtn onClick={assess}>Assess Readiness</PrimaryBtn>

      {assessed && (
        <div style={{ marginTop: 20 }}>
          {allCriticalPassed ? (
            <InfoBox title={allPassed ? "✅ Practical Completion Can Be Certified" : "✅ Practical Completion Likely Achievable"} color={A.teal}>
              {allPassed ? (
                "All criteria are satisfied. The CA can issue the Practical Completion Certificate under Cl. 2.30. This triggers: commencement of the Rectification Period, release of half the retention (Cl. 4.18), the end of the Contractor's liability for liquidated damages, and the transfer of insurance responsibility to the Employer."
              ) : (
                <>The critical criteria are all satisfied, but the following non-critical items remain: {nonCriticalFails.map(c => c.label).join("; ")}. These are snagging items that should be recorded and addressed during the Rectification Period — they should NOT prevent the issue of the Practical Completion Certificate, provided they are genuinely minor (Cl. 2.38).</>
              )}
            </InfoBox>
          ) : (
            <WarningBox title="❌ Practical Completion Cannot Be Certified">
              The following critical criteria are not satisfied: {criticalFails.map(c => c.label).join("; ")}. Under the principle established in H W Nevill (Sunblest) v William Press [1981], the works must be complete for all practical purposes and free from patent defects. The CA must NOT certify Practical Completion until these items are resolved — doing so could expose the CA to liability for negligent certification (Sutcliffe v Thackrah [1974]).
            </WarningBox>
          )}

          {notes && (
            <InfoBox title="📝 Notes Recorded" color={A.dim}>
              {notes}
            </InfoBox>
          )}
        </div>
      )}
    </div>
  );
}

// ─── CERTIFICATION TRACKER ──────────────────────────────────────────
function CertificationTracker() {
  const [possessionDate, setPossessionDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [pcDate, setPcDate] = useState("");
  const [rectMonths, setRectMonths] = useState("6");
  const [mgDate, setMgDate] = useState("");
  const [ivd, setIvd] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    const poss = parseDate(possessionDate);
    const comp = parseDate(completionDate);
    if (!poss || !comp) return;

    const pc = parseDate(pcDate);
    const mg = parseDate(mgDate);
    const ivdDate = parseDate(ivd);
    const rectPeriodMonths = parseInt(rectMonths) || 6;

    // Timeline items
    const items = [];

    items.push({ label: "Date of Possession", date: poss, note: "Contractor takes possession of site (Cl. 2.5)", color: A.teal });
    items.push({ label: "Completion Date", date: comp, note: "Date for completion stated in Contract Particulars (Cl. 1.1)", color: A.accent });

    // If IVD provided — show next payment cycle
    if (ivdDate) {
      const dueDate = addDays(ivdDate, 7);
      const certDeadline = addDays(dueDate, 5);
      items.push({ label: "Next IVD", date: ivdDate, note: "Interim Valuation Date — Contractor's Payment Application due (Cl. 4.10.1)", color: A.dim });
      items.push({ label: "Due Date", date: dueDate, note: "IVD + 7 days (Cl. 4.8)", color: A.teal });
      items.push({ label: "Interim Certificate Due", date: certDeadline, note: "Due date + 5 days — CA must issue (Cl. 4.9.1)", color: A.accent });
    }

    // Non-completion certificate
    if (!pc || pc > comp) {
      items.push({ label: "Non-Completion Certificate", date: comp, note: "If PC not achieved by Completion Date, CA must issue under Cl. 2.31 — prerequisite for LDs", color: "#f87171" });
    }

    // Post-PC items
    if (pc) {
      items.push({ label: "Practical Completion", date: pc, note: "PC Certificate issued (Cl. 2.30) — half retention released, Rectification Period begins", color: A.teal });
      const rectEnd = addMonths(pc, rectPeriodMonths);
      items.push({ label: "End of Rectification Period", date: rectEnd, note: `PC + ${rectMonths} months — Schedule of Defects due within 14 days (Cl. 2.38)`, color: A.accent });

      const contractorDocDeadline = addMonths(pc, 6);
      items.push({ label: "Contractor's Final Account Docs", date: contractorDocDeadline, note: "PC + 6 months — Contractor provides final account documents (Cl. 4.25.1)", color: A.dim });

      if (mg) {
        items.push({ label: "Certificate of Making Good", date: mg, note: "Defects made good — remaining retention released (Cl. 2.39 / 4.19)", color: A.teal });
      }

      const qsDeadline = addMonths(contractorDocDeadline, 3);
      const triggers = [rectEnd, qsDeadline];
      if (mg) triggers.push(mg);
      const latestTrigger = new Date(Math.max(...triggers.map(d => d.getTime())));
      const finalCertDeadline = addMonths(latestTrigger, 2);
      const adjudicationWindow = addDays(finalCertDeadline, 28);

      items.push({ label: "QS Adjustment Deadline", date: qsDeadline, note: "Contractor docs + 3 months — QS prepares final statement (Cl. 4.25.2)", color: A.dim });
      items.push({ label: "Final Certificate Deadline", date: finalCertDeadline, note: "Latest trigger + 2 months — CA must issue (Cl. 4.26.1)", color: A.accent });
      items.push({ label: "Conclusive Effect", date: adjudicationWindow, note: "Final Certificate + 28 days — challenge window closes (Cl. 1.9.2)", color: "#f87171" });
    }

    // Sort by date
    items.sort((a, b) => a.date - b.date);
    setResult(items);
  }

  return (
    <div>
      <ToolHeader icon="📜" title="Certification Tracker" subtitle="Enter your project dates to see every certificate the CA must issue and its deadline — from possession through to conclusive effect." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <InputField label="Date of Possession" hint="Cl. 2.5" type="date" value={possessionDate} onChange={e => setPossessionDate(e.target.value)} />
        <InputField label="Completion Date" hint="Contract Particulars" type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)} />
        <InputField label="Practical Completion Date (if issued)" type="date" value={pcDate} onChange={e => setPcDate(e.target.value)} />
        <InputField label="Certificate of Making Good (if issued)" type="date" value={mgDate} onChange={e => setMgDate(e.target.value)} />
        <InputField label="Next Interim Valuation Date (optional)" type="date" value={ivd} onChange={e => setIvd(e.target.value)} />
        <div style={{ display: "flex", gap: 12, alignItems: "end" }}>
          <div style={{ flex: 1 }}>
            <InputField label="Rectification Period (months)" type="number" value={rectMonths} onChange={e => setRectMonths(e.target.value)} style={{ textAlign: "center" }} />
          </div>
          <PrimaryBtn onClick={calculate} disabled={!possessionDate || !completionDate}>Track</PrimaryBtn>
        </div>
      </div>

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
          {result.map((s, i) => (
            <TimelineStep key={i} {...s} isLast={i === result.length - 1} />
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
    "The Employer is pressuring me to reduce the interim certificate. What should I do?",
    "The Contractor gave an oral instruction on site — how do I formalise it?",
    "I missed the 8-week deadline for an EOT decision. What are the consequences?",
    "Can I instruct the Contractor to work weekends to catch up on programme?",
    "The Contractor claims the variation I instructed was ultra vires. Is that right?",
    "Should I issue the PC certificate when there are minor snagging items outstanding?",
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
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", minHeight: 500 }}>
      <ToolHeader icon="💬" title="Situation Advisor" subtitle="Describe your contract administration situation and get advice grounded in the SBC/Q 2024 provisions and case law." />

      {messages.length === 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: A.dim, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600 }}>Common situations</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {QUICK_PROMPTS.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                style={{ padding: "9px 16px", borderRadius: 20, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.12)", color: A.sec, fontSize: 12, cursor: "pointer", textAlign: "left", lineHeight: 1.5, transition: "all 0.15s" }}
                onMouseEnter={e => { e.target.style.borderColor = A.teal; e.target.style.color = A.pri; }}
                onMouseLeave={e => { e.target.style.borderColor = A.bdr; e.target.style.color = A.sec; }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, marginBottom: 16, paddingRight: 4 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%", padding: "16px 20px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? A.userBg : A.aiBg, border: `1px solid ${A.bdr}` }}>
            {m.role === "assistant" && (
              <div style={{ fontSize: 11, fontWeight: 700, color: A.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: A.accent }} />
                CA Advisor
              </div>
            )}
            <div style={{ fontSize: 14, lineHeight: 1.8, color: A.pri, whiteSpace: "pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", padding: "16px 20px", borderRadius: "18px 18px 18px 4px", background: A.aiBg, border: `1px solid ${A.bdr}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: A.accent, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: A.accent, animation: "pulse 1.5s infinite" }} />
              CA Advisor
            </div>
            <div style={{ fontSize: 14, color: A.dim, fontStyle: "italic" }}>Reviewing the contract provisions…</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Describe your situation — e.g. 'The Employer wants me to issue a variation but I think it's beyond the scope of the contract...'"
          rows={2}
          style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1px solid ${A.bdr}`, background: "rgba(0,0,0,0.2)", color: A.pri, fontSize: 14, lineHeight: 1.5, resize: "none", fontFamily: "inherit" }} />
        <PrimaryBtn onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{ alignSelf: "end" }}>
          Send
        </PrimaryBtn>
      </div>
      <div style={{ fontSize: 11, color: A.dim, marginTop: 8, textAlign: "center", lineHeight: 1.5 }}>
        This advisor provides guidance based on the SBC/Q 2024 contract. It is not legal advice. Always consult a qualified professional for specific situations.
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
export default function ContractAdminAssistant() {
  const [activeTool, setActiveTool] = useState("instructions");

  const toolComponent = {
    instructions: <InstructionDrafter />,
    eot: <EOTHelper />,
    pc: <PCAssessor />,
    certs: <CertificationTracker />,
    advisor: <AdvisorTool />,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${A.bdr}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${A.dim}; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7); }
      `}</style>

      <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', 'Helvetica Neue', -apple-system, sans-serif", background: A.bg, overflow: "hidden" }}>
        {/* ─── SIDEBAR ─── */}
        <nav style={{ width: 260, minHeight: "100%", background: "#091727", display: "flex", flexDirection: "column", flexShrink: 0, borderRight: `1px solid ${A.bdr}`, overflow: "hidden" }}>
          <div style={{ padding: "28px 22px 22px", borderBottom: `1px solid ${A.bdr}` }}>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, color: A.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Module 3</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 19, color: A.pri, lineHeight: 1.3 }}>Contract Administrator Assistant</div>
            <div style={{ fontSize: 11, color: A.dim, marginTop: 8 }}>SBC/Q 2024 — Your Project</div>
          </div>

          <div style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
            {TOOLS.map((t) => {
              const active = activeTool === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTool(t.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 22px", background: active ? "rgba(232,168,56,0.08)" : "transparent", border: "none", borderLeft: active ? `3px solid ${A.accent}` : "3px solid transparent", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? A.pri : A.sec }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: A.dim, marginTop: 2, lineHeight: 1.4 }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ padding: "14px 22px", borderTop: `1px solid ${A.bdr}`, fontSize: 11, color: A.dim, lineHeight: 1.6 }}>
            Templates and calculations are local. The Situation Advisor uses AI and should be verified independently.
          </div>
        </nav>

        {/* ─── MAIN PANEL ─── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "36px 44px 64px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {toolComponent[activeTool]}
          </div>
        </main>
      </div>
    </>
  );
}
