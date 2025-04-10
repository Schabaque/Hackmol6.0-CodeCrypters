import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';
import Hero from '../Components/Hero/Hero';
import Stats from '../Components/Stats/Stats';
import Features from '../Components/Features/Features';
import Footer from '../Components/Footer/Footer';
import Faq from '../Components/Faq/Faq';
const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <Faq />
        <main className="flex-grow">
          <Routes>
            
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;