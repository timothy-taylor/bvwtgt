import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import CSRFToken from "../Cookies";
import NewPost from "./NewPost";
import NewTag from "./NewTag";

const Login = ({handleLogin, handleLogout}) => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState([]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleClick = () => {
    axios
      .delete(
        "/api/logout",
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken(document.cookie),
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.logged_out) {
          handleLogout();
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/login",
        {
          user: {
            email: email,
            password: password,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken(document.cookie),
          },
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.logged_in) {
          handleLogin(response.data);
        } else {
          setErrors(response.data.errors);
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>You are logged in</h1>
          <button onClick={() => handleClick()}>Log out</button>
          <NewTag />
          <NewPost />
        </>
      ) : (
        <>
          <h1>Log In</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e)}
            />
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e)}
            />
            <button placeholder="submit" type="submit">
              Log In
            </button>
          </form>
          <div id="errors">
            <ul>
              {errors.map((e, i) => (
                <li key={e + i}>{e}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      <div>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
};

export default Login;
