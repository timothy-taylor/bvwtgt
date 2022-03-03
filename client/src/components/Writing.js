import { Link } from "react-router-dom";
import { marked } from "marked";
import Layout from "./Layout";

marked.setOptions({ breaks: true });

const Writing = ({ posts }) => {
  return (
    <Layout active="Writing">
      <main id="main-content">
        {(posts || []).map((e, i) => (
          <article key={"post" + i} className="post">
            <h2 key={"title" + i}>
              <Link to={"/post/" + e.id}>{e.title}</Link>
            </h2>
            <h3 key={"subtitle" + i}>{e.created_at}</h3>
          </article>
        ))}
      </main>
    </Layout>
  );
};

export default Writing;
