import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import Commands from '../Components/Commands/Commands';
import Home from '../Components/Home/Home';
import Dashboard from '../Components/Dashboard/Dashboard';
// import About from '../Pages/About';
import StatsPage from '../Components/Stats/Stats';
import FeaturesPage from '../Components/Features/Features';
import FaqPage from '../Components/Faq/Faq';
import GasPrice from '../Components/GasPrice/GasPrice'; // also fixed typo in path "Componets" → "Components"

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/commands" element={<Commands />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/gas" element={<GasPrice />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
