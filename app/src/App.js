import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom"
import { Route } from "react-router";
// import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { DataContextProvider } from "./context/DataContext";
import "./App.css"
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ExamCounter from "./pages/examCounter";

function App() {

  // const { isLoading, error } = useAuth0();

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  // if (isLoading) {
  //   return <h2 className="p-5">Loading</h2>;
  // }

  return (
    <div className="App">
      <DataContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/examCounter" element={<ExamCounter />} />
          </Routes>
        </Router>
      </DataContextProvider>
    </div >
  );
}

export default App;
