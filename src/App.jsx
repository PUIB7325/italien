import { useState } from "react";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [selectedFormat, setSelectedFormat] = useState(null);

  return (
    <div className="app-container">
      {!selectedFormat ? (
        <Onboarding onSelect={setSelectedFormat} />
      ) : (
        <Dashboard
          format={selectedFormat}
          onBack={() => setSelectedFormat(null)}
        />
      )}
    </div>
  );
}

export default App;
