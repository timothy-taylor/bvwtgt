import { Link } from "react-router-dom";
import { marked } from "marked";
import Header from "./Header";
import Footer from "./Footer";

marked.setOptions({ breaks: true });

const Writing = (props) => {

  return (
    <>
    <Header active="Writing" />
    <main>
        {(props.posts || []).map((e, i) => (
          <div key={"post" + i} class="post">
            <h2 key={"title" + i}>
              <Link to={"/post/" + e.id}>{e.title}</Link>
            </h2>
            <h3 key={"subtitle" + i}>
              Last updated {e.updated_at}
            </h3>
            <div key={"content" + i} dangerouslySetInnerHTML={{__html: marked.parse(e.content)}} />
          </div>
        ))}
    </main>
      <Footer />
    </>
  )
}

export default Writing;

