import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom, userAtom } from "../Atoms";
import CSRFToken from "../Cookies";

export default function User() {
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handlePasswordConfirmationChange = (e) =>
    setPasswordConfirmation(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .patch(
        "/api/users/" + user.id,
        {
          user: {
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
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
        setPassword("");
        setPasswordConfirmation("");
        console.log(response.status);
      })
      .catch((error) => console.log("api errors:", error));
  };

  return (
    <>
      {isLoggedIn && (
        <>
          <div>Hi Tim</div>
          <Link to="/login">log in / out / new post</Link>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e)}
            />
            <input
              placeholder="new password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e)}
            />
            <input
              placeholder="confirm password"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => handlePasswordConfirmationChange(e)}
            />
            <button type="submit">Update</button>
          </form>
        </>
      )}
      <Link to="/">Home</Link>
    </>
  );
}
