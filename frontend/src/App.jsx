import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import Home from "./components/Home/Home";

function App() {
  const isLoggedIn = false;
  return (
    <Router>
      <Navigation isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/home" element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path="/home/guest" element={<Home isLoggedIn={isLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;
