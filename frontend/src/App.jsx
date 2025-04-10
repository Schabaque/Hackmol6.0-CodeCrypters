import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../Components/Dashboard/Dashboard";
import Commands from "../Components/Commands/Commands";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/commands" element={<Commands />} />
        {/* You can add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
