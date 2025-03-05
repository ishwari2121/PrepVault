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
import ErrorPage from "./Pages/ErrorPage";
import CompanyDetails from "./Pages/CompanyDetails";
import UserNavbar from "./components/UserNavbar";

function Layout() {
  const location = useLocation();

  const hideNavbarRoutes = ["/signin", "/signup", "/dashboard"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<><UserNavbar /><Home /></>} />
        <Route path="/LLM" element={<LLM />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/interviews" element={<SharedInterview />} />
        <Route path="/company/:companyName" element={<CompanyDetails />} />
        <Route path="/question-answer" element={<QuesAns />} />
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
