import React from "react";
import {BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AboutSection from "./components/AboutSection";
import Testimonials from "./components/Testimonials";
import Recommender_Form from "./components/Recommender_Form";
import Footer from "./components/Footer";
import LocalEventsPage from "./components/Features/LocalEventsPage";
import HiddenGemsPage from "./components/Features/HiddenGemsPage";
import LocalGuide from "./components/Features/LocalGuide";
import Expense_Form from "./components/Expense_Form";
import Feedback_Form from "./components/Feedback_Form";
import WeatherAlerts from "./components/Features/weatheralerts";
import "./App.css";
import SmartPool from "./components/SmartPool";
import FashionRecommender from "./components/FashionRecommender";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<HeroSection />} />
          <Route path='/home' element={<HeroSection />} />
          <Route path='/recommender' element={<Recommender_Form />} />
          <Route path='/features' element={<FeaturesSection />} />
          <Route path='/about' element={<AboutSection />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path='/expenses' element={<Expense_Form />} />
          <Route path='/feedback' element={<Feedback_Form />} />
          <Route path="/weather-alerts" element={<WeatherAlerts />} />
          <Route path="/local-events" element={<LocalEventsPage />} />
          <Route path="/hidden-gems" element={<HiddenGemsPage />} />
          <Route path="/local-guide" element={<LocalGuide/>} />
          <Route path="/smartPool" element={<SmartPool/>} />
          <Route path="/predict" element={<FashionRecommender/>} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;

