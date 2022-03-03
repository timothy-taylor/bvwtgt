import React from "react";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import PostAPI from "../api/post";

const NewTag = () => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [name, setName] = React.useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await PostAPI.newTag(name);
    if (status === 201) {
      setName("");
    } else {
      console.log(status);
    }
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
