import React from "react";
import { Link } from "react-router-dom";
import hero from "../assets/hero.svg";

const Header = (props) => {
  const [title, setTitle] = React.useState("BVWTGT");

  React.useEffect(() => {
    const writing = document.getElementById("nav-writing");
    const about = document.getElementById("nav-about");
    [writing, about].forEach((e) => e.classList.remove("active"));

    switch (props.active) {
      case "Writing":
        writing.classList.add("active");
        break;
      case "About":
        about.classList.add("active");
        break;
      default:
    }
  }, []);

  return (
    <header>
      <img src={hero} alt="" id="hero-image" />
      <nav>
        <h1
          id="nav-title"
          onMouseEnter={() => setTitle("Tim Taylor")}
          onMouseLeave={() => setTitle("BVWTGT")}
        >
          {title}
        </h1>
        <Link to="/writing">
          <button id="nav-writing">Writing</button>
        </Link>
        <Link to="/about">
          <button id="nav-about">About</button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
