import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import AleradyAuth from "./components/AlreadyAuth";
import OAuthRedirectHandler from "./components/OAuthRedirectHandler";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PersistLogin />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route element={<RequireAuth />}></Route>
        </Route>
        <Route path="/oauth-recall" element={<OAuthRedirectHandler />} />
        <Route element={<AleradyAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
