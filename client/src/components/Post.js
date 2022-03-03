import React from "react";
import { marked } from "marked";
import { Link, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import Header from "./Header";
import Footer from "./Footer";
import DisplayPost from "./DisplayPost";
import PostAPI from "../api/post";

const Post = () => {
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
    PostAPI.createPost(post, id);
  };

  React.useEffect(() => {
    const data = PostAPI.getPost(id);
    setPost({
      title: data.title,
      content: data.content,
      tag: data.tag_id,
    });
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
