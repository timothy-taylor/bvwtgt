import React from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import CSRFToken from "../Cookies";
import Header from "./Header";
import Footer from "./Footer";
import { marked } from "marked";

const Post = () => {
  const { id } = useParams();
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tag, setTag] = React.useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(
        "/api/posts/" + id,
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
          // success
        } else {
          console.log(response.status);
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  React.useEffect(() => {
    axios
      .get("/api/posts/" + id, {
        id: id,
      })
      .then((response) => {
        setTitle(response.data.title);
        setContent(response.data.content);
        setTag(response.data.tag_id);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Header />
      <main>
        <div class="post">
          <h2>{title}</h2>
          <p dangerouslySetInnerHTML={{ __html: marked.parse(content) }} />
        </div>
        {isLoggedIn && (
          <>
            <p>post_id = {id}</p>
            <p>tag_id = {tag}</p>
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
              <button
                type="submit"
                onClick={(e) => (e.currentTarget.style.borderColor = "green")}
              >
                Save Changes
              </button>
            </form>
          </>
        )}
        <Link to="/writing">Back to writing</Link>
      </main>
      <Footer />
    </>
  );
};

export default Post;
