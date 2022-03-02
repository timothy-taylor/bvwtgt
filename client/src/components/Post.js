import React from "react";
import axios from "axios";
import { marked } from "marked";
import { Link, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import CSRFToken from "../Cookies";
import Header from "./Header";
import Footer from "./Footer";
import DisplayPost from "./DisplayPost";

const Post = () => {
  const timeoutAxios = axios.create({ timeout: 1000 });
  const { id } = useParams();
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [post, setPost] = React.useState({
    title: "",
    content: "",
    tag: "",
  });

  const updatePost = (value) =>
    setPost((prev) => {
      return { ...prev, ...value };
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    timeoutAxios
      .patch(
        "/api/posts/" + id,
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
          // success
        } else {
          console.log(response.status);
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  React.useEffect(() => {
    timeoutAxios
      .get("/api/posts/" + id, {
        id: id,
      })
      .then((response) => {
        setPost({
          title: response.data.title,
          content: response.data.content,
          tag: response.data.tag_id,
        });
      })
      .catch((error) => console.log(error));
  }, [id]);

  return (
    <>
      <Header />
      <main>
        <DisplayPost title={post.title} markdown={marked.parse(post.content)} />
        {isLoggedIn && (
          <>
            <p>post_id = {id}</p>
            <p>tag_id = {post.tag}</p>
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                placeholder="title"
                type="text"
                value={post.title}
                onChange={(e) => updatePost({ title: e.target.value })}
              />
              <br />
              <textarea
                placeholder="content"
                value={post.content}
                onChange={(e) => updatePost({ content: e.target.value })}
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
