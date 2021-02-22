import React, { useState } from "react";
import axios from "axios";

const Login = ({
  toRegMode,
  setToken,
  setIsAuthenticated,
  setDisplayError,
  setConfirmation,
  setUser
}) => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const handleEmail = (e) => {
    e.preventDefault();
    setInputEmail(e.target.value);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setInputPassword(e.target.value);
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (inputEmail === "" || inputPassword === "") {
      setInputEmail("");
      setInputPassword("");
      setDisplayError("Enter email and password to login.");
      return;
    }
    const user = {
      email: inputEmail,
      password: inputPassword,
    };
    axios
      .post("http://localhost:5000/user/login", user)
      .then((res) => {
        console.log("logged in. auth-token: " + res.data);
        setUser({
          name: 'Parthenon Huxley',
          title: 'Web Developer'
        });
        setToken(res.data);
        setIsAuthenticated(true);
        return;
      })
      .catch((err) => {
        console.log("authentication error");
        setConfirmation(null);
        setDisplayError("Incorrect email or password.");
      });
    setInputEmail("");
    setInputPassword("");
  };

  return (
    <div>
      <div className="input-wrapper">
        <label htmlFor="email">email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={inputEmail}
          placeholder="email"
          onChange={handleEmail}
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={inputPassword}
          placeholder="password"
          onChange={handlePassword}
        />
      </div>
      <button onClick={handleSubmitLogin}>login</button>
      <button onClick={toRegMode}>register</button>
    </div>
  );
};

export default Login;
