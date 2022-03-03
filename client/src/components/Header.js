import React from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import hero from "../assets/hero.svg";
import { Light, Dark } from "../assets/Icons";
import { themeAtom } from "../Atoms";


const Header = (props) => {
  const [title, setTitle] = React.useState("BVWTGT");
  const [theme, setTheme] = useAtom(themeAtom);
  const toggleTheme = () => setTheme((prev) => {
    return prev === "light" ? "dark" : "light"
  })

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
  }, [props.active]);

  return (
    <>
      <a id="skip-nav" className="screenreader-text" href="#main-content">
        Skip to Content
      </a>
      <header>
        <img src={hero} alt="" id="hero-image" />
        {theme === "light" && <Light handleClick={toggleTheme} />}
        {theme === "dark" && <Dark handleClick={toggleTheme} />}
        <h1
          id="nav-title"
          onMouseEnter={() => setTitle("Tim Taylor")}
          onMouseLeave={() => setTitle("BVWTGT")}
        >
          {title}
        </h1>
      </header>
      <nav>
        <Link to="/writing">
          <button id="nav-writing">Writing</button>
        </Link>
        <Link to="/about">
          <button id="nav-about">About</button>
        </Link>
      </nav>
    </>
  );
};

export default Header;
