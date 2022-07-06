import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import Layout from "./Layout";
import PostAPI from "../api/post";

const usePostQuery = () => useQuery("posts", PostAPI.getPosts);

const Posts = ({ status, data, error }) => {
  if (status === "loading") return "Loading posts...";
  if (status === "error") return `Something went wrong, ${error.message}`;
  return (
    <>
      {data.map((e, i) => (
        <article key={"post" + i} className="post">
          <h2 key={"title" + i}>
            <Link to={"/post/" + e.id}>{e.title}</Link>
          </h2>
          <h3 key={"subtitle" + i}>{e.created_at}</h3>
        </article>
      ))}
    </>
  );
};

export default function Writing() {
  const { status, data, error } = usePostQuery();

  return (
    <Layout active="Writing">
      <main id="main-content">
        <Posts {...{ status, data, error }} />
      </main>
    </Layout>
  );
}
