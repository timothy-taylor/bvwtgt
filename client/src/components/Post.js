import React from "react";
import { useQuery } from "react-query";
import { marked } from "marked";
import { Link, useParams } from "react-router-dom";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import Layout from "./Layout";
import DisplayPost from "./DisplayPost";
import PostAPI from "../api/post";

const usePost = (id) => useQuery(["post", id], () => PostAPI.getPost(id));

const Post = () => {
  const { id } = useParams();
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const { status, data, error } = usePost(id);
  const [post, setPost] = React.useState({
    title: "",
    content: "",
    tag: "",
  });

  const updatePost = (value) =>
    setPost((prev) => {
      return { ...prev, ...value };
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const status = await PostAPI.updatePost(post, id);
    if (status !== 201) {
      console.log(status);
    }
  };

  React.useEffect(() => {
    data &&
      setPost({
        title: data.title,
        content: data.content,
        tag: data.tag_id,
      });
  }, [data]);

  return (
    <>
      <Layout>
      <main>
        {status === "loading" ? (
          "Loading Post..."
        ) : status === "error" ? (
          <span>Something went wrong {error.message}</span>
        ) : (
          <DisplayPost
            title={post.title}
            markdown={marked.parse(post.content)}
          />
        )}
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
      </Layout>
    </>
  );
};

export default Post;
