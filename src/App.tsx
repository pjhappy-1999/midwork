import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Slide2 from "@/pages/Slide2";
import Slide3 from "@/pages/Slide3";
import Slide4 from "@/pages/Slide4";
import Slide5 from "@/pages/Slide5";
import End from "@/pages/End";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/slide2" element={<Slide2 />} />
        <Route path="/slide3" element={<Slide3 />} />
        <Route path="/slide4" element={<Slide4 />} />
        <Route path="/slide5" element={<Slide5 />} />
        <Route path="/end" element={<End />} />
      </Routes>
    </Router>
  );
}
