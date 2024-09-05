import React from "react";
import {BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import AboutSection from "./components/AboutSection";
import Testimonials from "./components/Testimonials";
import Recommender_Form from "./components/Recommender_Form";
import Footer from "./components/Footer";
import Expense_Form from "./components/Expense_Form";
import Feedback_Form from "./components/Feedback_Form";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/home' element={<HeroSection />} />
          <Route path='/recommender' element={<Recommender_Form />} />
          <Route path='/features' element={<FeaturesSection />} />
          <Route path='/about' element={<AboutSection />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path='/expenses' element={<Expense_Form />} />
          <Route path='/feedback' element={<Feedback_Form />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </BrowserRouter>
  );
}

export default App;

