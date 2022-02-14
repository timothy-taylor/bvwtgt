import React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import CSRFToken from "../Cookies";

const NewTag = () => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [name, setName] = React.useState("");
  const handleNameChange = (e) => setName(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/tags",
        {
          tag: {
            name: name,
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
        if (response.status === 201) {
          setName("");
        } else {
          console.log(response.status)
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  return (
    <>
      {isLoggedIn && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            placeholder="new tag"
            value={name}
            onChange={(e) => handleNameChange(e)}
          />
          <br />
          <button type="submit">Create New Tag</button>
        </form>
      )}
    </>
  );
};

export default NewTag;
