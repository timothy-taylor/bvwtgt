import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { marked } from "marked";
import Layout from "./Layout";
import PostAPI from "../api/post";

marked.setOptions({ breaks: true });

const usePosts = () => useQuery('posts', PostAPI.getPosts);

const Writing = () => {
  const { status, data, error, isFetching } = usePosts();

  return (
    <Layout active="Writing">
      <main id="main-content">
        {status === "loading" ? (
          "Loading Posts..."
        ) : status === "error" ? (
          <span>Something went wrong {error.message}</span>
        ) : (
          <>
        {(data).map((e, i) => (
          <article key={"post" + i} className="post">
            <h2 key={"title" + i}>
              <Link to={"/post/" + e.id}>{e.title}</Link>
            </h2>
            <h3 key={"subtitle" + i}>{e.created_at}</h3>
          </article>
        ))}
          </>
  )}
        <div>{isFetching ? "Background Updating..." : " "}</div>
      </main>
    </Layout>
  );
};

export default Writing;
