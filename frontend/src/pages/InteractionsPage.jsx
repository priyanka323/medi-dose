import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Alert, Spinner, Card, CheckIcon, AlertIcon } from "../components/UI";

export default function InteractionsPage() {
  const [allMeds, setAllMeds] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingMeds, setFetchingMeds] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.searchMedicines()
      .then(setAllMeds)
      .catch(() => setError("Could not load medicines. Is the backend running?"))
      .finally(() => setFetchingMeds(false));
  }, []);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleCheck = async () => {
    if (selected.length < 2) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const data = await api.checkInteractions(selected);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setSelected([]); setResult(null); setError(null); };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Drug Interaction Checker</h1>
        <p>Select two or more medicines to check for potential interactions</p>
      </div>

      {/* Medicine Selector */}
      <Card>
        <div className="card-top-row">
          <h2 className="card-heading" style={{ margin: 0 }}>
            Select Medicines
            {selected.length > 0 && (
              <span className="count-badge">{selected.length} selected</span>
            )}
          </h2>
          {selected.length > 0 && (
            <button className="btn-ghost btn-sm" onClick={handleReset}>Clear All</button>
          )}
        </div>

        {fetchingMeds ? (
          <div className="loading-state"><Spinner /><span>Loading medicines...</span></div>
        ) : (
          <div className="med-select-grid">
            {allMeds.map((med) => {
              const isSelected = selected.includes(med.id);
              return (
                <button
                  key={med.id}
                  className={`med-select-btn ${isSelected ? "med-selected" : ""}`}
                  onClick={() => toggle(med.id)}
                >
                  <div className={`med-select-check ${isSelected ? "check-active" : ""}`}>
                    {isSelected && <CheckIcon size={11} />}
                  </div>
                  <div className="med-select-info">
                    <div className="med-select-name">{med.name}</div>
                    <div className="med-select-cat">{med.category}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="btn-row" style={{ marginTop: "20px" }}>
          <button
            className="btn-primary"
            onClick={handleCheck}
            disabled={selected.length < 2 || loading}
          >
            {loading ? <Spinner /> : `Check ${selected.length} Medicine${selected.length !== 1 ? "s" : ""} →`}
          </button>
          {selected.length < 2 && (
            <span className="field-hint">Select at least 2 medicines</span>
          )}
        </div>
      </Card>

      {/* Results */}
      {error && <Alert type="danger" style={{ marginTop: "20px" }}>{error}</Alert>}

      {result && (
        <Card className="fade-in" style={{ marginTop: "24px" }}>
          <h2 className="card-heading">
            Interaction Results
            <span className={`count-badge ${result.interactions_found > 0 ? "badge-red" : "badge-green"}`}>
              {result.interactions_found} found
            </span>
          </h2>

          {result.interactions_found === 0 ? (
            <Alert type="success">
              No known interactions found between the {result.total_checked} selected medicines.
            </Alert>
          ) : (
            <div className="interaction-list">
              {result.interactions.map((item, idx) => (
                <div key={idx} className="interaction-card">
                  <div className="int-pair">
                    <span className="int-drug-name">{item.drug_a}</span>
                    <span className="int-arrow">⟷</span>
                    <span className="int-drug-name">{item.drug_b}</span>
                  </div>
                  <div className="int-severity">
                    <AlertIcon size={13} />
                    {item.severity.toUpperCase()} INTERACTION
                  </div>
                  <p className="int-message">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}