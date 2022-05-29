import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom"
import { Route } from "react-router";
// import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { DataContextProvider } from "./context/DataContext";
import "./App.css"
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

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
      {/* <Auth0Provider
        domain="https://dev-hny8cmer.us.auth0.com"
        clientId="N91ZHT4NnfsOXHn5cRZodES9CBPqKdlp"
        redirectUri={"http://localhost:3000/"}
      > */}
      <DataContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/exam-counter" element={<Dashboard />} />
          </Routes>
        </Router>
      </DataContextProvider>
      {/* </Auth0Provider> */}
    </div >
  );
}

export default App;
