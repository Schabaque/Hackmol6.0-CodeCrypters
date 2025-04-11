import React from 'react';
import Hero from '../Hero/Hero';
import Stats from '../Stats/Stats';
import Features from '../Features/Features';
import Faq from '../Faq/Faq';
import Timeline from '../FreshPrinceTimeline/FreshPrinceTimeline';
const Home = () => {
  return (
    <div>
      <Hero />
      <Stats />
      <Features />
      <Faq />
      <Timeline />
      {/* Add more components as needed */}
    </div>
  );
};

export default Home;
