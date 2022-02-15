import { Link } from "react-router-dom";
import Header from "./Header";

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
            <p key={"content" + i}>{e.content}</p>
          </div>
        ))}
    </main>
    </>
  )
}

export default Writing;

