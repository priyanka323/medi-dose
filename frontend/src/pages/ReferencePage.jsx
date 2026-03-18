import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Alert, Spinner, Badge } from "../components/UI";

export default function ReferencePage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.searchMedicines()
      .then(setMedicines)
      .catch(() => setError("Could not load medicines. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  if (loading) return <div className="loading-state page"><Spinner /><span>Loading database...</span></div>;
  if (error) return <div className="page"><Alert type="danger">{error}</Alert></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Medicine Reference Database</h1>
        <p>{medicines.length} medicines with complete dosing parameters</p>
      </div>

      {/* Search bar */}
      <div className="ref-search-wrap">
        <input
          className="input"
          placeholder="Filter by medicine name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "420px" }}
        />
        {search && (
          <span className="ref-count">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Table */}
      <div className="ref-table-wrap">
        <table className="ref-table">
          <thead>
            <tr>
              <th>Medicine</th>
              <th>Category</th>
              <th>Dose / kg</th>
              <th>Max Single</th>
              <th>Max Daily</th>
              <th>Frequency</th>
              <th>Route</th>
              <th>Min Age</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((med) => (
              <>
                <tr key={med.id} className={expanded === med.id ? "row-expanded" : ""}>
                  <td className="td-medicine">{med.name}</td>
                  <td><Badge color="blue">{med.category}</Badge></td>
                  <td className="td-mono">{med.dose_per_kg} mg/kg</td>
                  <td className="td-mono">{med.max_single_dose_mg} mg</td>
                  <td className="td-mono">{med.max_daily_dose_mg} mg</td>
                  <td className="td-mono">q{med.frequency_hours}h</td>
                  <td>{med.route}</td>
                  <td>{med.min_age_months < 12 ? `${med.min_age_months}mo` : `${Math.floor(med.min_age_months / 12)}yr`}</td>
                  <td>
                    <button className="expand-btn" onClick={() => toggleExpand(med.id)}>
                      {expanded === med.id ? "▲" : "▼"}
                    </button>
                  </td>
                </tr>

                {/* Expanded row */}
                {expanded === med.id && (
                  <tr key={`${med.id}-exp`} className="expanded-row">
                    <td colSpan={9}>
                      <div className="expanded-content">
                        <div className="exp-col">
                          <div className="exp-label">Clinical Notes</div>
                          <div className="exp-text">{med.notes}</div>
                        </div>
                        {med.contraindications?.length > 0 && (
                          <div className="exp-col">
                            <div className="exp-label">Contraindications</div>
                            <div className="chip-row">
                              {med.contraindications.map((c) => (
                                <span key={c} className="chip chip-danger">{c}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {med.interactions?.length > 0 && (
                          <div className="exp-col">
                            <div className="exp-label">Interactions</div>
                            <div className="chip-row">
                              {med.interactions.map((i) => (
                                <span key={i} className="chip chip-warn">{i}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="exp-col">
                          <div className="exp-label">Pediatric Max Single Dose</div>
                          <div className="exp-text">{med.pediatric_max_single_dose_mg} mg</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-table">No medicines match "{search}"</div>
        )}
      </div>
    </div>
  );
}