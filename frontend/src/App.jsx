import axios from "axios";
axios.defaults.withCredentials = true;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import { useLocation } from "react-router-dom";
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
import InterviewDetail from "./components/InterviewDetail";
import CommonQuestion from "./components/CommonQuestion";
import DeveloperPage from "./Pages/DeveloperPage";
import MainAdmin from "./Admin/MainAdmin";
import AddCompanies from "./Admin/AddCompanies";
import AddMCQ from "./Admin/AddMCQ";
import Profile from "./Pages/Profile";

import { Toaster } from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;

  return user ? (
    children
  ) : (
    <Navigate to="/signin" replace state={{ from: location }} />
  );
};

function Layout() {
  return (
    <>
      <UserNavbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/:id/signin" element={<Signin />} />
        <Route path="/signin/commonQuestion" element={<Signin />} />
        <Route path="/signin/addAns/:id" element={<Signin />} />
        <Route path="/developer" element={<DeveloperPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <Home />
        } />
        <Route path="/resumeAnalyzer" element={
          <PrivateRoute><ResumeAnalyzer /></PrivateRoute>
        } />
        <Route path="/interviewexp" element={
          <PrivateRoute><Interview /></PrivateRoute>
        } />
        <Route path="/companies" element={
        <Companies />
        } />
        <Route path="/stories" element={
          <PrivateRoute><SharedInterview /></PrivateRoute>
        } />
        <Route path="/company/:companyName" element={
          <CompanyDetails />
        } />
        <Route path="/interview/:id" element={
          <PrivateRoute><InterviewDetail /></PrivateRoute>
        } />
        <Route path="/commonQuestion" element={
          <PrivateRoute><CommonQuestion /></PrivateRoute>
        } />
        <Route path="/answer/:id" element={
          <PrivateRoute><QuesAns /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <PrivateRoute><MainAdmin /></PrivateRoute>
        } />
        <Route path="/addcompany" element={
          <PrivateRoute><AddCompanies /></PrivateRoute>
        } />
        <Route path="/addmcqs" element={
          <PrivateRoute><AddMCQ /></PrivateRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Toaster />
    </>
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
