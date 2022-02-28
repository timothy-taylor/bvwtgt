import { Link } from "react-router-dom";
import { marked } from "marked";
import Header from "./Header";
import Footer from "./Footer";

marked.setOptions({ breaks: true });

const Writing = (props) => {
  return (
    <>
      <Header active="Writing" />
      <main id="main-content">
        {(props.posts || []).map((e, i) => (
          <article key={"post" + i} className="post">
            <h2 key={"title" + i}>
              <Link to={"/post/" + e.id}>{e.title}</Link>
            </h2>
            <h3 key={"subtitle" + i}>{e.created_at}</h3>
          </article>
        ))}
      </main>
      <Footer />
    </>
  );
};

export default Writing;
