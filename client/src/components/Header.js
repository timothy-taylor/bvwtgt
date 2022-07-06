import { useEffect } from "react";
import { useAtom } from "jotai";
import { Link } from "react-router-dom";
import { Light, Dark } from "../assets/Icons";
import { themeAtom } from "../Atoms";
import hero from "../assets/hero.svg";

export default function Header({ active }) {
  const [theme, setTheme] = useAtom(themeAtom);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    // should be able to replace this whole effect
    // using <NavLink> from react-router-dom
    const writing = document.getElementById("nav-writing");
    const about = document.getElementById("nav-about");
    const projects = document.getElementById("nav-projects");
    [writing, about, projects].forEach((e) => e.classList.remove("active"));

    switch (active) {
      case "Writing":
        writing.classList.add("active");
        break;
      case "About":
        about.classList.add("active");
        break;
      case "Projects":
        projects.classList.add("active");
        break;
      default:
    }
  }, [active]);

  return (
    <>
      <a id="skip-nav" className="screenreader-text" href="#main-content">
        Skip to Content
      </a>
      <img src={hero} alt="" id="hero-image" />
      {theme === "light" && <Light handleClick={toggleTheme} />}
      {theme === "dark" && <Dark handleClick={toggleTheme} />}
      <nav>
        <Link to="/about">
          <button id="nav-about">About</button>
        </Link>
        <Link to="/writing">
          <button id="nav-writing">Writing</button>
        </Link>
        <Link to="/projects">
          <button id="nav-projects">Projects</button>
        </Link>
      </nav>
    </>
  );
}
