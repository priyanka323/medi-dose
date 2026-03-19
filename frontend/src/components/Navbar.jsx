// import { PillIcon, CalcIcon, FlaskIcon, BookIcon } from "./UI";

// const NAV_ITEMS = [
//   { id: "calculator", label: "Dose Calculator", Icon: CalcIcon },
//   { id: "interactions", label: "Drug Interactions", Icon: FlaskIcon },
//   { id: "reference", label: "Medicine DB", Icon: BookIcon },
// ];

// export default function Navbar({ activePage, onNavigate }) {
//   return (
//     <header className="navbar">
//       <div className="navbar-inner">
//         {/* Logo */}
//         <div className="logo" onClick={() => onNavigate("calculator")} style={{ cursor: "pointer" }}>
//           <div className="logo-icon">
//             <PillIcon size={20} />
//           </div>
//           <div>
//             <div className="logo-name">MediDose</div>
//             <div className="logo-sub">Clinical Dosing Assistant</div>
//           </div>
//         </div>

//         {/* Nav Links */}
//         <nav className="nav-links">
//           {NAV_ITEMS.map(({ id, label, Icon }) => (
//             <button
//               key={id}
//               className={`nav-btn ${activePage === id ? "active" : ""}`}
//               onClick={() => onNavigate(id)}
//             >
//               <Icon />
//               {label}
//             </button>
//           ))}
//         </nav>
//       </div>
//     </header>
//   );
// }
import { FiHome, FiActivity, FiBook, FiCpu } from 'react-icons/fi';

const NAV_ITEMS = [
  { id: "calculator", label: "Dose Calculator", Icon: FiHome },
  { id: "interactions", label: "Drug Interactions", Icon: FiActivity },
  { id: "reference", label: "Medicine DB", Icon: FiBook },
];

export default function Navbar({ activePage, onNavigate }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <div className="logo" onClick={() => onNavigate("calculator")} style={{ cursor: "pointer" }}>
          <div className="logo-icon">
            <FiCpu size={20} />
          </div>
          <div>
            <div className="logo-name">MediDose</div>
            <div className="logo-sub">AI Clinical Assistant</div>
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
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}