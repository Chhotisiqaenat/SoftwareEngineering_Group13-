import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import AccountInfo from "./Pages/AccountInfo";

import CreateGroup from "./Pages/CreateGroup";
import JoinGroup from "./Pages/JoinGroup";
import GroupDetails from "./Pages/GroupDetails";
import SubmitAvailability from "./Pages/SubmitAvailability";
import GroupResults from "./Pages/GroupResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<AccountInfo />} />

        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/join-group" element={<JoinGroup />} />
        <Route path="/group/:groupId" element={<GroupDetails />} />
        <Route path="/group/:groupId/availability" element={<SubmitAvailability />} />
        <Route path="/group/:groupId/results" element={<GroupResults />} />
      </Routes>
    </Router>
  );
}

export default App;
