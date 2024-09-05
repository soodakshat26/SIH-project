import React from "react";
import { Route, Routes } from "react-router-dom";
import LocalEventsPage from "./components/Features/LocalEventsPage";
import HiddenGemsPage from "./components/Features/HiddenGemsPage";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AboutSection from "./components/AboutSection";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
  
import "./App.css";

function App() {
  return (
    
    <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <FeaturesSection />
              <AboutSection />
              <Testimonials />
              <Footer />
            </>
          } />
          <Route path="/local-events" element={<LocalEventsPage />} />
          <Route path="/hidden-gems" element={<HiddenGemsPage />} />
        </Routes>
      </div>
    
  );
}

export default App;
