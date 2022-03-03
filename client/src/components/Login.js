import React from "react";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import NewPost from "./NewPost";
import NewTag from "./NewTag";
import UserAPI from "../api/user";

const Login = ({ handleLogin, handleLogout }) => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [errors, setErrors] = React.useState([]);
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });

  const updateCredentials = (value) =>
    setCredentials((prev) => {
      return { ...prev, ...value };
    });

  const handleClick = async () => {
    const data = await UserAPI.logout();
    if (data.logged_out) {
      handleLogout();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await UserAPI.login(credentials.email, credentials.password);
    if (data.logged_in) {
      handleLogin(data.user);
    } else {
      setErrors(data.errors);
    }
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
              value={credentials.email}
              onChange={(e) => updateCredentials({ email: e.target.value })}
            />
            <input
              placeholder="password"
              type="password"
              value={credentials.password}
              onChange={(e) => updateCredentials({ password: e.target.value })}
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
