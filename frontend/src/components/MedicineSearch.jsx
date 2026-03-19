// import { useState, useEffect, useRef } from "react";
// import { api } from "../services/api";
// import { SearchIcon } from "./UI";

// export default function MedicineSearch({ value, onSelect, placeholder = "Search medicine..." }) {
//   const [query, setQuery] = useState(value?.name || "");
//   const [results, setResults] = useState([]);
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);
//   const [searchQ, setSearchQ] = useState("");

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => { 
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     if (query.length < 2) { setResults([]); setOpen(false); return; }
//     const timer = setTimeout(async () => {
//       try {
//         const data = await api.searchMedicines(query);
//         setResults(data);
//         setOpen(true);
//       } catch { setResults([]); }
//     }, 250);
//     return () => clearTimeout(timer);
//   }, [query]);

//   const handleSelect = (med) => {
//     setQuery(med.name);
//     setOpen(false);
//     onSelect(med);
//   };

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//     onSelect(null); // clear selection when typing
//   };
//     // Filtered list
//   const filtered = medicines.filter(m => {
//     if (!searchQ) return true;
//     const q = searchQ.toLowerCase();
//     return (
//       m.name.toLowerCase().includes(q) ||
//       m.category.toLowerCase().includes(q) ||
//       m.aliases.some(a => a.toLowerCase().includes(q))
//     );
//   });
//     const selectMedicine = (med) => {
//     setSelectedMed(med);
//     setSearchQ(med.name);
//     setShowDropdown(false);
//     setResult(null);
//     setError(null);
//   };


//   return (
//      {/* Medicine Search */}
//             <div className="search-wrap">
//               <span className="search-icon">⌕</span>
//               <input
//                 ref={searchRef}
//                 className="search-input"
//                 placeholder="Search medicine or brand name..."
//                 value={searchQ}
//                 onChange={e => { setSearchQ(e.target.value); setShowDropdown(true); setSelectedMed(null); }}
//                 onFocus={() => setShowDropdown(true)}
//               />
//               {showDropdown && filtered.length > 0 && (
//                 <div className="dropdown" ref={dropdownRef}>
//                   {filtered.map(m => (
//                     <div
//                       key={m.id}
//                       className={`dropdown-item ${selectedMed?.id === m.id ? "selected" : ""}`}
//                       onMouseDown={() => selectMedicine(m)}
//                     >
//                       <div>
//                         <div className="dropdown-name">{m.name}</div>
//                         <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
//                           {m.aliases.slice(0, 3).join(" · ")}
//                         </div>
//                       </div>
//                       <span className="dropdown-cat">{m.category}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//     <div className="search-container" ref={ref}>
//       <div className="search-wrap">
//         <span className="search-icon"><SearchIcon /></span>
//         <input
//         ref={searchRef}
//           className="input search-input"
//           placeholder={placeholder}
//           value={query}
//           onChange={handleChange}
//           onFocus={() => results.length && setOpen(true)}
//           autoComplete="off"
//         />
//       </div>

//       {open && results.length > 0 && (
//         <div className="dropdown">
//           {results.map((med) => (
//             <div key={med.id} className="dropdown-item" onClick={() => handleSelect(med)}>
//               <div>
//                 <div className="drop-name">{med.name}</div>
//                 <div className="drop-meta">{med.category} · {med.route}</div>
//               </div>
//               <span className="drop-dose">{med.dose_per_kg} mg/kg</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// // }
// import { useState, useEffect, useRef } from "react";
// import { api } from "../services/api";
// import { SearchIcon } from "./UI";

// export default function MedicineSearch({ value, onSelect, placeholder = "Search medicine..." }) {
//   const [query, setQuery] = useState(value?.name || "");
//   const [results, setResults] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const containerRef = useRef(null);
//   const inputRef = useRef(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => { 
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   // Debounced search
//   useEffect(() => {
//     if (query.length < 2) { 
//       setResults([]); 
//       setOpen(false); 
//       return; 
//     }
    
//     setLoading(true);
//     const timer = setTimeout(async () => {
//       try {
//         const data = await api.searchMedicines(query);
//         setResults(data);
//         setOpen(true);
//       } catch (error) {
//         console.error("Search failed:", error);
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [query]);

//   const handleSelect = (med) => {
//     setQuery(med.name);
//     setOpen(false);
//     onSelect(med);
//   };

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//     onSelect(null); // clear selection when typing
//   };

//   const handleFocus = () => {
//     if (results.length > 0) {
//       setOpen(true);
//     }
//   };

//   return (
//     <div className="search-container" ref={containerRef}>
//       <div className="search-wrap">
//         <span className="search-icon">
//           <SearchIcon />
//         </span>
//         <input
//           ref={inputRef}
//           className="input search-input"
//           placeholder={placeholder}
//           value={query}
//           onChange={handleChange}
//           onFocus={handleFocus}
//           autoComplete="off"
//         />
//         {loading && <span className="search-loading" />}
//       </div>

//       {open && results.length > 0 && (
//         <div className="dropdown">
//           {results.map((med) => (
//             <div 
//               key={med.id} 
//               className="dropdown-item" 
//               onClick={() => handleSelect(med)}
//             >
//               <div>
//                 <div className="drop-name">{med.name}</div>
//                 <div className="drop-meta">
//                   {med.category} · {med.route || 'N/A'}
//                 </div>
//               </div>
//               {med.dose_per_kg && (
//                 <span className="drop-dose">{med.dose_per_kg} mg/kg</span>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { SearchIcon } from "./UI";

export default function MedicineSearch({ value, onSelect, placeholder = "Search medicine..." }) {
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { 
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { 
      setResults([]); 
      setOpen(false); 
      return; 
    }
    
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.searchMedicines(query);
        // Remove duplicates by id
        const uniqueData = Array.from(new Map(data.map(item => [item.id, item])).values());
        setResults(uniqueData);
        setOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    
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

  const handleFocus = () => {
    if (results.length > 0) {
      setOpen(true);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-400">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          autoComplete="off"
        />
        {loading && (
          <span className="absolute right-3 w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {results.map((med) => (
            <div 
              key={med.id} 
              className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
              onClick={() => handleSelect(med)}
            >
              <div>
                <div className="font-medium text-gray-900">{med.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {med.category} · {med.route || 'N/A'}
                </div>
              </div>
              {med.dose_per_kg && (
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                  {med.dose_per_kg} mg/kg
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}