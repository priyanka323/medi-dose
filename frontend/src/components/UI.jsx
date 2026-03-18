// ─── Icons ───────────────────────────────────────────────
export function SearchIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export function AlertIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function PillIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10.5 20H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H20a2 2 0 012 2v5" />
      <circle cx="17" cy="17" r="5" /><path d="m14.5 19.5 5-5" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

export function FlaskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 3h6M9 3v6.551a2 2 0 01-.28.99l-5.72 9.46A1 1 0 004.13 21H19.87a1 1 0 00.85-1.52l-5.72-9.46a2 2 0 01-.28-.99V3" />
    </svg>
  );
}

export function CalcIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2M16 18h2" />
    </svg>
  );
}

// ─── Spinner ─────────────────────────────────────────────
export function Spinner() {
  return <span className="spinner" />;
}

// ─── Alert ───────────────────────────────────────────────
export function Alert({ type = "info", children }) {
  const cls = { danger: "alert-danger", success: "alert-success", warning: "alert-warning", info: "alert-info" };
  return (
    <div className={`alert ${cls[type]}`}>
      {type === "danger" && <AlertIcon />}
      {type === "success" && <CheckIcon />}
      {type === "warning" && <AlertIcon />}
      <span>{children}</span>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────
export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

// ─── Badge ────────────────────────────────────────────────
export function Badge({ children, color = "blue" }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}