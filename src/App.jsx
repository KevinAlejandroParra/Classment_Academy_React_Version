import "./App.css";
<<<<<<< HEAD
=======
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
>>>>>>> 0446885 (fix: register and login operation)
import { useState, useEffect } from "react";
import CustomNavbar from "./components/Navbar.jsx";
import { Banner } from "./components/Banner.jsx";
import { AccessibilityWidget } from "sena-accessibility";
<<<<<<< HEAD
import SwiperCarousel from "./components/CarrouselCourses.jsx";
import SchoolsCarousel from "./components/CarrouselSchools.jsx";

function App() {
 

  return (
    <>
      <CustomNavbar />
      <Banner />
      <AccessibilityWidget theme="light" />
      <SwiperCarousel />
      <SchoolsCarousel />
    </>
=======
import SwiperCarousel from "./components/Carrousel.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/login.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
                <CustomNavbar />
            <Banner />
            <SwiperCarousel />
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <AccessibilityWidget theme="light" />
    </Router>
>>>>>>> 0446885 (fix: register and login operation)
  );
}

export default App;
