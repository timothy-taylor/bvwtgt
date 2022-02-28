import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom, isLoggedInAtom } from "../Atoms";
import Header from "./Header";
import Footer from "./Footer";

const About = () => {
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <>
      <Header active="About" />
      <main id="main-content">
        <h2>Hi, I'm Tim.</h2>
        <h3>
          Software Developer | Frontend + Fullstack | Javascript, HTML5, CSS3,
          React, Ruby on Rails
        </h3>
        <p className="about-content">
          I'm a software developer using mostly Javascript and Ruby (with a bit
          exploring with Lua, Rust, C/C++). I appreciate good UI, responsive
          designs, well-structured code, and git version control.
        </p>
        <p className="about-content">
          I'm also a person, musician, and a team player with a knack for
          staying cool under fire who loves to work on interesting projects of
          all kinds.
        </p>
        <p className="about-content">
          Using my experience as a luthier and instrument designer I treat my
          process of creating software as the building of an instrument: making
          something that is both simple and easily discoverable yet rewards
          deeper interaction and study. In my free time I enjoy coding musical
          controllers and interfaces for both the browser and various hardware
          devices.
        </p>
        <div className="about-content">
          <em>My other interests include:</em>
          <ul>
            <li>
              Learning about:
              <ul>
                <li>synthesis / sound / instrument design</li>
                <li>chess</li>
                <li>skateboarding</li>
                <li>jazz guitar</li>
                <li>the Japanese language</li>
              </ul>
            </li>
            <li>
              Meditating on:
              <ul>
                <li>Andrei Tarkovsky films</li>
                <li>Rilke, Hesse, Nabakov, Camus, etc</li>
                <li>Bauhausian modernism</li>
                <li>Camusian restraint as rebellion minimalism</li>
                <li>iterative processes and generative patterns</li>
                <li>the grounding rhymths of the universe</li>
              </ul>
            </li>
            <li>
              Creating good habits for:
              <ul>
                <li>enjoying matcha</li>
                <li>watching the Boston Celtics</li>
                <li>making music</li>
                <li>morning workouts</li>
                <li>laughing with Chris Farley</li>
                <li>balancing free improvisation with intentionality</li>
              </ul>
            </li>
          </ul>
        </div>
        <br />
        <p>contact @ tim [at] bvwtgt [dot] xyz</p>
        <a href="https://www.linkedin.com/in/timothy-g-taylor">LinkedIn</a>
        <a href="https://github.com/timothy-taylor">Github</a>
        <a href="https://tgtmusic.bandcamp.com/">Bandcamp</a>
        <a href="https://open.spotify.com/artist/5pJDAJfpQWFQJVOB16Gx70?si=XUQiPH22QduDUyMmuIjV6g">
          Spotify
        </a>
        <br />
        {isLoggedIn && (
          <Link to={"/user/" + user.id}>hi tim / new post / log out / etc</Link>
        )}
      </main>
      <Footer />
    </>
  );
};

export default About;
