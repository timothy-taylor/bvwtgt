import React from "react";
import { Link } from "react-router-dom";

const Home = (props) => {
  return (
    <>
      <header></header>
      <main>
        {(props.posts || []).map((e, i) => (
          <div key={"post" + i}>
            <h2 key={"title" + i}>
              <Link to={"/post/" + e.id}>{e.title}</Link>
            </h2>
            <p key={"content" + i}>{e.content}</p>
          </div>
        ))}
      </main>
      <footer>
        <Link to="/about">About</Link>
      </footer>
    </>
  );
};

export default Home;
