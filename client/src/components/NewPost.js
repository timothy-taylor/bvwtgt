import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { isLoggedInAtom } from "../Atoms";
import PostAPI from "../api/post";

export default function NewPost() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [tags, setTags] = useState([]);
  const [post, setPost] = useState({
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

    const status = await PostAPI.createPost(post);
    if (status === 201) {
      setPost({
        title: "",
        content: "",
        tag: "",
      });
    } else {
      console.log(status);
    }
  };

  const getAndSetTags = async () => {
    const data = await PostAPI.getTags();
    setTags(data);
  };

  useEffect(() => {
    getAndSetTags();
  }, []);

  return (
    <>
      {isLoggedIn && (
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
          <label htmlFor="tag-list">Tags</label>
          <input
            name="tag-list"
            type="text"
            list="tags"
            onChange={(e) => updatePost({ tag: e.target.value.split(":")[0] })}
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
}
