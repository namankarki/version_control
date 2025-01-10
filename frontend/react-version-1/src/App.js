import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Home from "./pages/Home";
import CommitPage from "./pages/commit";
import Dashboard from "./pages/dashboard";
import EditProfile from "./pages/editprojile";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/repositories/:id/commits" element={<CommitPage />} />
        <Route path="/repositories/:repoId/commits" element={<CommitPage />} />

      </Routes>
    </Router>
  );
};

export default App;
