import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import PostJobPage from "./pages/PostJobPage";
import JobDetailPage from "./pages/JobDetailPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";

const App: React.FC = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile/:wallet" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;