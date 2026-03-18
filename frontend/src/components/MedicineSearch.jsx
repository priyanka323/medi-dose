import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { SearchIcon } from "./UI";

export default function MedicineSearch({ value, onSelect, placeholder = "Search medicine..." }) {
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    const timer = setTimeout(async () => {
      try {
        const data = await api.searchMedicines(query);
        setResults(data);
        setOpen(true);
      } catch { setResults([]); }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (med) => {
    setQuery(med.name);
    setOpen(false);
    onSelect(med);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSelect(null); // clear selection when typing
  };

  return (
    <div className="search-container" ref={ref}>
      <div className="search-wrap">
        <span className="search-icon"><SearchIcon /></span>
        <input
          className="input search-input"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => results.length && setOpen(true)}
          autoComplete="off"
        />
      </div>

      {open && results.length > 0 && (
        <div className="dropdown">
          {results.map((med) => (
            <div key={med.id} className="dropdown-item" onClick={() => handleSelect(med)}>
              <div>
                <div className="drop-name">{med.name}</div>
                <div className="drop-meta">{med.category} · {med.route}</div>
              </div>
              <span className="drop-dose">{med.dose_per_kg} mg/kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}