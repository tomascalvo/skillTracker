import React, { useState } from "react";
import axios from "axios";

const Register = ({
  toLoginMode,
  setMode,
  setDisplayError,
  setConfirmation,
}) => {
  const [inputUser, setInputUser] = useState({
    name: "",
    title: "",
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    e.preventDefault();
    setInputUser({
      ...inputUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputUser);
    axios
      .post("http://localhost:5000/user/register", inputUser)
      .then((res) => {
        setDisplayError(false);
        setConfirmation("registration successfull");
        setMode("login");
      })
      .catch((err) => {
        console.log(err);
        setInputUser({
          name: "",
          title: "",
          email: "",
          password: "",
        });
        setDisplayError(true);
      });
  };

  return (
    <div>
      <div className="input-wrapper">
        <label htmlFor="name">name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={inputUser.name}
          placeholder="name"
          onChange={handleInput}
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="title">title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={inputUser.title}
          placeholder="title"
          onChange={handleInput}
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="email">email</label>
        <input
          type="text"
          id="email"
          name="email"
          value={inputUser.email}
          placeholder="email"
          onChange={handleInput}
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="password">password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={inputUser.password}
          placeholder="password"
          onChange={handleInput}
        />
      </div>
      <button onClick={handleSubmit}>submit registration</button>
      <button onClick={toLoginMode}>login instead</button>
    </div>
  );
};

export default Register;
