import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Home from "./Pages/Home";
import Navbar from "./Pages/NavBar";
import LLM from "./Pages/LLM";
import Stories from "./Pages/Stories";
import Companies from "./Pages/Companies";
import SharedInterview from "./components/SharedInterview";
import QuesAns from "./components/QuesAns";
function Layout() {
  const location = useLocation(); 

  const hideNavbarRoutes = ["/signin", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/LLM" element={<LLM/>}/>
        <Route path="/stories" element={<Stories/>}/>
        <Route path="/companies" element={<Companies/>}/>
        <Route path="/interviews" element={<SharedInterview/>}/>
        <Route path="/question-answer" element={<QuesAns/>}/>
        
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
