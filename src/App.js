import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./Pages/login";
import Register from "./Pages/Register";
import ForgotPassword from "./Pages/ForgotPassword";

import Dashboard from "./Pages/Dashboard";
import AccountInfo from "./Pages/AccountInfo";
import CreateGroup from "./Pages/CreateGroup";
import JoinGroup from "./Pages/JoinGroup";
import GroupPage from "./Pages/GroupPage";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* Routes WITH Sidebar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<AccountInfo />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/join-group" element={<JoinGroup />} />
        </Route>

        {/* 🔥 Route WITHOUT Sidebar */}
        <Route path="/group/:groupId" element={<GroupPage />} />

      </Routes>
    </Router>
  );
}

export default App;