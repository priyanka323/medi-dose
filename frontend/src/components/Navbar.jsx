import { PillIcon, CalcIcon, FlaskIcon, BookIcon } from "./UI";

const NAV_ITEMS = [
  { id: "calculator", label: "Dose Calculator", Icon: CalcIcon },
  { id: "interactions", label: "Drug Interactions", Icon: FlaskIcon },
  { id: "reference", label: "Medicine DB", Icon: BookIcon },
];

export default function Navbar({ activePage, onNavigate }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="logo" onClick={() => onNavigate("calculator")} style={{ cursor: "pointer" }}>
          <div className="logo-icon">
            <PillIcon size={20} />
          </div>
          <div>
            <div className="logo-name">MedicDose</div>
            <div className="logo-sub">Clinical Dosing Assistant</div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="nav-links">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`nav-btn ${activePage === id ? "active" : ""}`}
              onClick={() => onNavigate(id)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}