// import { useState } from "react";
// import MedicineSearch from "../components/MedicineSearch";
// import DoseResult from "../components/DoseResult";
// import { Alert, Spinner, Card } from "../components/UI";
// import { api } from "../services/api";

// const CONDITIONS = [
//   "renal impairment",
//   "hepatic impairment",
//   "penicillin allergy",
//   "asthma",
//   "peptic ulcer",
//   "QT prolongation",
//   "tachycardia",
//   "diabetes",
// ];

// export default function CalculatorPage() {
//   const [selectedMed, setSelectedMed] = useState(null);
//   const [weight, setWeight] = useState("");
//   const [ageYears, setAgeYears] = useState("");
//   const [ageMonths, setAgeMonths] = useState("");
//   const [conditions, setConditions] = useState([]);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const totalMonths = () => (parseFloat(ageYears) || 0) * 12 + (parseFloat(ageMonths) || 0);

//   const toggleCondition = (c) =>
//     setConditions((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

//   const handleCalculate = async () => {
//     if (!selectedMed || !weight) return;
//     setLoading(true);
//     setError(null);
//     setResult(null);
//     try {
//       const data = await api.calculateDose({
//         medicine_id: selectedMed.id,
//         weight_kg: parseFloat(weight),
//         age_months: totalMonths(),
//         conditions,
//       });
//       setResult(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setSelectedMed(null);
//     setWeight("");
//     setAgeYears("");
//     setAgeMonths("");
//     setConditions([]);
//     setResult(null);
//     setError(null);
//   };

//   return (
//     <div className="page">
//       <div className="page-header">
//         <h1>Dose Calculator</h1>
//         <p>Weight-based dosing with pediatric &amp; adult safety validation</p>
//       </div>

//       <div className="two-col-layout">
//         {/* ── Left: Form ── */}
//         <Card className="form-card">
//           <h2 className="card-heading">Patient &amp; Medicine</h2>

//           {/* Medicine Search */}
//           <div className="field">
//             <label className="field-label">Medicine</label>
//             <MedicineSearch
//               value={selectedMed}
//               onSelect={(med) => { setSelectedMed(med); setResult(null); setError(null); }}
//               placeholder="Type medicine name e.g. Paracetamol..."
//             />
//           </div>

//           {/* Weight */}
//           <div className="field">
//             <label className="field-label">Patient Weight (kg)</label>
//             <input
//               className="input"
//               type="number"
//               min="0.5"
//               max="300"
//               step="0.1"
//               placeholder="e.g. 15"
//               value={weight}
//               onChange={(e) => setWeight(e.target.value)}
//             />
//           </div>

//           {/* Age */}
//           <div className="field">
//             <label className="field-label">Patient Age</label>
//             <div className="row-2">
//               <input
//                 className="input"
//                 type="number"
//                 min="0"
//                 max="120"
//                 placeholder="Years"
//                 value={ageYears}
//                 onChange={(e) => setAgeYears(e.target.value)}
//               />
//               <input
//                 className="input"
//                 type="number"
//                 min="0"
//                 max="11"
//                 placeholder="Months"
//                 value={ageMonths}
//                 onChange={(e) => setAgeMonths(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Conditions */}
//           <div className="field">
//             <label className="field-label">
//               Patient Conditions <span className="label-hint">(optional)</span>
//             </label>
//             <div className="conditions-grid">
//               {CONDITIONS.map((c) => (
//                 <button
//                   key={c}
//                   className={`condition-chip ${conditions.includes(c) ? "chip-active" : ""}`}
//                   onClick={() => toggleCondition(c)}
//                 >
//                   {conditions.includes(c) && (
//                     <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
//                       <polyline points="20 6 9 17 4 12" />
//                     </svg>
//                   )}
//                   {c}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="btn-row">
//             <button
//               className="btn-primary"
//               onClick={handleCalculate}
//               disabled={!selectedMed || !weight || loading}
//             >
//               {loading ? <Spinner /> : "Calculate Safe Dose →"}
//             </button>
//             <button className="btn-ghost" onClick={handleReset}>
//               Reset
//             </button>
//           </div>
//         </Card>

//         {/* ── Right: Result ── */}
//         <div className="result-col">
//           {!result && !error && !loading && (
//             <div className="empty-state">
//               <div className="empty-emoji">⚕️</div>
//               <p>Fill in the patient details and select a medicine to get a safe dose calculation.</p>
//               <div className="empty-tips">
//                 <div className="tip">💡 Doses are automatically capped at max safe limits</div>
//                 <div className="tip">💡 Pediatric doses differ from adult doses</div>
//                 <div className="tip">💡 Add conditions to trigger safety warnings</div>
//               </div>
//             </div>
//           )}

//           {loading && (
//             <div className="loading-state">
//               <Spinner />
//               <span>Calculating safe dose...</span>
//             </div>
//           )}

//           {error && <Alert type="danger">{error}</Alert>}

//           {result && <DoseResult result={result} />}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import MedicineSearch from "../components/MedicineSearch";
import DoseResult from "../components/DoseResult";
import AIChatBot from "../components/AIChatBot";
import PatientProfileCard from "../components/PatientProfileCard";
import { Alert, Spinner, Card } from "../components/UI";
import { api } from "../services/api";

export default function CalculatorPage() {
  const [selectedMed, setSelectedMed] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [weight, setWeight] = useState("");
  const [ageYears, setAgeYears] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [conditions, setConditions] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const totalMonths = () => 
    (parseFloat(ageYears) || 0) * 12 + (parseFloat(ageMonths) || 0);

  const handleCalculate = async () => {
    if (!selectedMed || !weight) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.calculateDose({
        medicine_id: selectedMed.id,
        weight_kg: parseFloat(weight),
        age_months: totalMonths() || 1,
        conditions: [...conditions, ...(patientProfile?.conditions || [])],
      });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestion = (suggestion) => {
    setAiSuggestion(suggestion);
    if (suggestion.medicine) {
      setSelectedMed(suggestion.medicine);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>AI-Powered Dose Calculator</h1>
        <p>Smart dosing with predictive analytics and clinical intelligence</p>
      </div>

      <div className="two-col-layout">
        {/* Left Column */}
        <div className="left-col">
          <Card>
            <PatientProfileCard onProfileChange={setPatientProfile} />
          </Card>

          <Card className="ai-chat-card">
            <div className="card-header">
              <h3>AI Assistant</h3>
              <button 
                className="btn-ghost btn-sm"
                onClick={() => setShowAIChat(!showAIChat)}
              >
                {showAIChat ? 'Hide' : 'Chat'}
              </button>
            </div>
            {showAIChat && (
              <AIChatBot 
                patientContext={patientProfile}
                onRecommendation={handleAISuggestion}
              />
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="right-col">
          <Card>
            <h2 className="card-heading">Medication Details</h2>

            {aiSuggestion && (
              <div className="ai-suggestion">
                <div className="suggestion-content">
                  <strong>🤖 AI Suggestion</strong>
                  <p>{aiSuggestion.reasoning || 'Based on patient profile'}</p>
                </div>
                <button 
                  className="btn-sm btn-primary"
                  onClick={() => {
                    if (aiSuggestion.medicine) {
                      setSelectedMed(aiSuggestion.medicine);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            )}

            <div className="field">
              <label className="field-label">Medicine</label>
              <MedicineSearch
                value={selectedMed}
                onSelect={(med) => {
                  setSelectedMed(med);
                  setResult(null);
                  setError(null);
                }}
                placeholder="Type medicine name..."
              />
            </div>

            <div className="field">
              <label className="field-label">Weight (kg)</label>
              <input
                className="input"
                type="number"
                min="0.5"
                step="0.1"
                placeholder="e.g., 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="field-label">Age</label>
              <div className="row-2">
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="Years"
                  value={ageYears}
                  onChange={(e) => setAgeYears(e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="11"
                  placeholder="Months"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn-primary btn-large"
              onClick={handleCalculate}
              disabled={!selectedMed || !weight || loading}
            >
              {loading ? <Spinner /> : 'Calculate Safe Dose →'}
            </button>

            {error && <Alert type="danger" style={{ marginTop: '16px' }}>{error}</Alert>}
          </Card>

          {result && <DoseResult result={result} />}
        </div>
      </div>
    </div>
  );
}