import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Home from "./Pages/Home";
import Navbar from "./Pages/NavBar";
import LLM from "./Pages/LLM";
import Interview from "./Pages/InterviewExp";
import Companies from "./Pages/Companies";
import SharedInterview from "./Pages/SharedInterview";
import QuesAns from "./Components/QuesAns";
import ErrorPage from "./Pages/ErrorPage";
import CompanyDetails from "./Pages/CompanyDetails";
import UserNavbar from "./Components/UserNavbar";
import { AuthContext } from './Context/AuthContext';
import { useContext } from "react";
import InterviewDetail from "./Components/InterviewDetail";

function Layout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);  
  const hideNavbarRoutes = ["/signin", "/signup"];
  const shouldShowNavbar = !user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {user ? <UserNavbar /> : shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/LLM" element={<LLM />} />
        <Route path="/interviewexp" element={<Interview />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/interviews" element={<SharedInterview />} />
        <Route path="/company/:companyName" element={<CompanyDetails />} />
        <Route path="/question-answer" element={<QuesAns />} />
        <Route path="/interview/:id" element={<InterviewDetail />} />
        <Route path="*" element={<ErrorPageWrapper />} />
      </Routes>
    </>
  );
}

function ErrorPageWrapper() {
  return <ErrorPage />;
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
