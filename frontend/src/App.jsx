import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Home from "./Pages/Home";
<<<<<<< HEAD
import Navbar from "./Pages/NavBar";
import LLM from "./Pages/ResumeAnalyzer";
=======
>>>>>>> 1d71cd032dc781719e485e5af2e6d8e3161c9067
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
import { Toaster} from 'react-hot-toast'
import CommonQuestion from "../src/components/CommonQuestion";
import ADD_questions from "./Pages/ADD_questions"

// ✅ Create and export context
export const LoginFromInterviewExp = createContext();

function Layout() {
  const [loginFromInterview, setLoginFromInterview] = useState(false);
  
  return (
    <LoginFromInterviewExp.Provider value={{ loginFromInterview, setLoginFromInterview }}>
      <UserNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signin/commonQuestion?category=technical" element={<Signin />} />
        <Route path="/signin/addAns/:id" element={<Signin />} />
        <Route path="/dashboard" element={<Home />} />
        {/* <Route path="/LLM" element={<ResumeAnalyzer/>} /> */}
        <Route path="/interviewexp" element={<Interview />} />
        <Route path="/companies" element={<Companies />} />
        {/* <Route path="/interviews" element={<SharedInterview />} /> */}
        <Route path="/stories" element={<SharedInterview/>} />
        <Route path="/company/:companyName" element={<CompanyDetails />} />
        {/* <Route path="/question-answer" element={<QuesAns />} /> */}
        <Route path="/interview/:id" element={<InterviewDetail />} />
        <Route path="/admin" element={<ADD_questions/>} />
        <Route path="/commonQuestion" element={<CommonQuestion/>} />
        <Route path="/answer/:id" element={<QuesAns/>} />
        <Route path="*" element={<ErrorPage />} />
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
