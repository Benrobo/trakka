import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom"
import { Route } from "react-router";
import { DataContextProvider } from "./context/DataContext";
import "./App.css"
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ExamCounter from "./pages/examCounter";
import Statistics from "./pages/stats";

function App() {
  return (
    <div className="app">
      <DataContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/examCounter" element={<ExamCounter />} />
            <Route path="/stats" element={<Statistics />} />
          </Routes>
        </Router>
      </DataContextProvider>
    </div >
  );
}

export default App;
