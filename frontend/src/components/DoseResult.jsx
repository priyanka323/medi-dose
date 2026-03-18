import { CheckIcon, AlertIcon, Badge } from "./UI";

export default function DoseResult({ result }) {
  if (!result) return null;

  const { medicine, category, route, patient, dosing, safe, warnings, notes, interactions } = result;

  return (
    <div className={`dose-result fade-in ${safe ? "result-safe" : "result-unsafe"}`}>

      {/* Header */}
      <div className="result-header">
        <div className={`result-status-badge ${safe ? "badge-safe" : "badge-danger"}`}>
          {safe ? <><CheckIcon size={13} /> Safe Dose</> : <><AlertIcon size={13} /> Review Required</>}
        </div>
        <h2 className="result-medicine">{medicine}</h2>
        <p className="result-meta">
          <Badge color="teal">{category}</Badge>
          <Badge color="blue">{route}</Badge>
          <Badge color={patient.patient_type === "Pediatric" ? "orange" : "gray"}>{patient.patient_type}</Badge>
        </p>
      </div>

      {/* Hero dose */}
      <div className="dose-hero">
        <div className="dose-main">
          <span className="dose-number">{dosing.final_dose_mg}</span>
          <span className="dose-unit">mg</span>
        </div>
        <div className="dose-sublabel">Single Dose</div>
        <div className="dose-freq">{dosing.frequency}</div>
      </div>

      {/* Stats grid */}
      <div className="dose-stats-grid">
        {[
          { val: `${dosing.daily_dose_mg}mg`, label: "Daily Total" },
          { val: `${dosing.doses_per_day}×`, label: "Times / Day" },
          { val: `${dosing.max_single_dose_mg}mg`, label: "Max Single" },
          { val: `${dosing.dose_per_kg_used}mg/kg`, label: "Formula" },
        ].map(({ val, label }) => (
          <div key={label} className="dose-stat">
            <div className="stat-val">{val}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="result-section">
          {warnings.map((w, i) => (
            <div key={i} className={`warning-row ${w.includes("CONTRAINDICATED") || w.includes("WARNING") ? "warn-danger" : "warn-info"}`}>
              {w}
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      <div className="result-section">
        <div className="section-label">Clinical Notes</div>
        <p className="section-text">{notes}</p>
      </div>

      {/* Interactions */}
      {interactions?.length > 0 && (
        <div className="result-section">
          <div className="section-label">Known Interactions</div>
          <div className="chip-row">
            {interactions.map((i) => <span key={i} className="chip chip-warn">{i}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}