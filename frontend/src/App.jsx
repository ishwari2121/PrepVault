import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Home from "./Pages/Home";
import ResumeAnalyzer from "./Pages/ResumeAnalyzer";
import Interview from "./Pages/InterviewExp";
import Companies from "./Pages/Companies";
import SharedInterview from "./Pages/SharedInterview";
import QuesAns from "./components/QuesAns";
import ErrorPage from "./Pages/ErrorPage";
import CompanyDetails from "./Pages/CompanyDetails";
import UserNavbar from "./components/UserNavbar";
import { AuthProvider } from "./Context/AuthContext";
import { createContext, useState } from "react";
import InterviewDetail from "./components/InterviewDetail";
import { Toaster } from "react-hot-toast";
import CommonQuestion from "../src/components/CommonQuestion";
import DeveloperPage from "./Pages/DeveloperPage";
import MainAdmin from "./Admin/MainAdmin";
import AddCompanies from "./Admin/AddCompanies";
import AddMCQ from "./Admin/AddMCQ";
import Profile from "./Pages/Profile";

// ✅ Create and export context
export const LoginFromInterviewExp = createContext();

function Layout() {
  const [loginFromInterview, setLoginFromInterview] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <LoginFromInterviewExp.Provider value={{ loginFromInterview, setLoginFromInterview }}>
      <UserNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/:id/signin" element={<Signin />} />
        <Route path="/signin/commonQuestion" element={<Signin />} />
        <Route path="/signin/addAns/:id" element={<Signin />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/resumeAnalyzer" element={<ResumeAnalyzer />} />
        <Route path="/interviewexp" element={<Interview />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/stories" element={<SharedInterview />} />
        <Route path="/company/:companyName" element={<CompanyDetails />} />
        <Route path="/interview/:id" element={<InterviewDetail />} />
        <Route path="/commonQuestion" element={<CommonQuestion />} />
        <Route path="/answer/:id" element={<QuesAns />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/developer" element={<DeveloperPage />} />
        <Route path="*" element={<ErrorPage />} />


        {/* Admin Routes */}
        <Route path="/admin" element={<MainAdmin />} />
        <Route path="/addcompany" element={<AddCompanies />} />
        <Route path="/addmcqs" element={<AddMCQ />} />
      </Routes>
      <Toaster />
    </LoginFromInterviewExp.Provider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;
