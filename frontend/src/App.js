import { useState } from "react";

import Navbar from "./components/Navbar";
import CalculatorPage from "./pages/CalculatorPage";
import InteractionsPage from "./pages/InteractionsPage";
import ReferencePage from "./pages/ReferencePage";
import CalculatorsPage from "./pages/CalculatorsPage"; // add this
import "./App.css";

// Page registry — add new pages here
const PAGES = {
  calculator: CalculatorPage,
  interactions: InteractionsPage,
  reference: ReferencePage,
  calculators: CalculatorsPage, // add this
  
};

export default function App() {
  const [activePage, setActivePage] = useState("calculator");

  const PageComponent = PAGES[activePage] || CalculatorPage;

  return (
    <div className="app">
      <Navbar activePage={activePage} onNavigate={setActivePage} />

      <main className="main-container">
        <PageComponent key={activePage} />
      </main>

      <footer className="app-footer">
        ⚕️ MediDose v2.0 &nbsp;·&nbsp; For clinical decision support only &nbsp;·&nbsp;
        Always verify with official references (BNF, WHO, local formulary)
      </footer>
    </div>
  );
}