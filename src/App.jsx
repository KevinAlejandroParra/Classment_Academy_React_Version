import "./App.css";
import CustomNavbar from "./components/Navbar.jsx";
import { Banner } from "./components/Banner.jsx";
import { AccessibilityWidget } from "sena-accessibility";
function App() {
  return (
    <>
      <CustomNavbar />
      <Banner/>
      <AccessibilityWidget theme="ligth" />
   
    </>
  );
}

export default App;
