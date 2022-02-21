import React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import CSRFToken from "../Cookies";

const NewPost = () => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [tags, setTags] = React.useState([]);
  const [post, setPost] = React.useState({
    title: "",
    content: "",
    tag: "",
  });

  const updatePost = (value) => setPost((prev) => {
    return { ...prev, ...value }; 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/posts",
        {
          post: {
            title: post.title,
            content: post.content,
            tag_id: post.tag,
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
          setPost({
            title: "",
            content: "",
            tag: "",
          })
        } else {
          console.log(response.status);
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  React.useEffect(() => {
    axios
      .get("/api/tags")
      .then((response) => setTags(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      {isLoggedIn && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            placeholder="title"
            type="text"
            value={post.title}
            onChange={(e) => updatePost({title: e.target.value})}
          />
          <br />
          <textarea
            placeholder="content"
            value={post.content}
            onChange={(e) => updatePost({content: e.target.value})}
          />
          <br />
          <label htmlFor="tag-list">Tags</label>
          <input
            name="tag-list"
            type="text"
            list="tags"
            onChange={(e) => updatePost({tag: e.target.value.split(":")[0]})}
          />
          <datalist id="tags">
            {tags.map((e) => (
              <option key={e.name} value={e.id + ": " + e.name} />
            ))}
          </datalist>
          <br />
          <button type="submit">Create New Post</button>
        </form>
      )}
    </>
  );
};

export default NewPost;
