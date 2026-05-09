import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Callback from "./Callback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;