import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import Commands from '../Components/Commands/Commands';
import Home from '../Components/Home/Home';
import Dashboard from '../Components/Dashboard/Dashboard';
//import About from '../Pages/About';
import StatsPage from '../Components/Stats/Stats';
import FeaturesPage from '../Components/Features/Features';
import FaqPage from '../Components/Faq/Faq';






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
           
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
