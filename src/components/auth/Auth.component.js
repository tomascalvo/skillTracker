import React, { useState } from "react";

import Login from "./Login.component";
import Register from "./Register.component";

const Auth = ({ setIsAuthenticated, setToken,setUser }) => {
  const [displayError, setDisplayError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [mode, setMode] = useState("login");

  const toRegMode = (e) => {
    e.preventDefault();
    setDisplayError(null);
    setMode("registration");
  };

  const toLoginMode = (e) => {
    e.preventDefault();
    setDisplayError(null);
    setMode("login");
  };

  return (
    <div className="glass form-wrapper">
      <h2>welcome to skillTracker</h2>
      <p>that which is measured improves</p>
      {mode === "registration" ? (
        // <p>registration</p>
        <Register
          toLoginMode={toLoginMode}
          setMode={setMode}
          setDisplayError={setDisplayError}
          setConfirmation={setConfirmation}
        />
        ) : (
        // <p>login</p>
        <Login
          toRegMode={toRegMode}
          setToken={setToken}
          setIsAuthenticated={setIsAuthenticated}
          setDisplayError={setDisplayError}
          setConfirmation={setConfirmation}
          setUser={setUser}
        />
      )}
      {displayError ? (
        <p className="warning">authentication error. {displayError}</p>
      ) : (
        ""
      )}
      {confirmation ? (
        <p className="confirmation">{confirmation}</p>
      ) : (
        ""
      )}
    </div>
  );
};

export default Auth;
