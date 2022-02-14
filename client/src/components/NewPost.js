import React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import CSRFToken from "../Cookies";

const NewPost = () => {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [tags, setTags] = React.useState([]);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleTagChange = (e) => {
    const [id] = e.target.value.split(":");
    setTag(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "/api/posts",
        {
          post: {
            title: title,
            content: content,
            tag_id: tag,
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
          setTitle("");
          setContent("");
          setTag("");
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
            value={title}
            onChange={(e) => handleTitleChange(e)}
          />
          <br />
          <textarea
            placeholder="content"
            value={content}
            onChange={(e) => handleContentChange(e)}
          />
          <br />
          <label htmlFor="tag-list">Tags</label>
          <input
            name="tag-list"
            type="text"
            list="tags"
            onChange={(e) => handleTagChange(e)}
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
