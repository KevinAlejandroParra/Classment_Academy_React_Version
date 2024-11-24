import "./App.css";
import CustomNavbar from "./components/Navbar.jsx";
import { Banner } from "./components/Banner.jsx";
import { AccessibilityWidget } from "sena-accessibility";
import { Carrousel } from "./components/Carrousel.jsx";
function App() {
  return (
    <>
      <CustomNavbar />
      <Banner/>
      <AccessibilityWidget theme="ligth" />
      <Carrousel />
   
    </>
  );
}

export default App;
