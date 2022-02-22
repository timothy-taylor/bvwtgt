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
          Software Developer | Frontend + Fullstack | Javascript, HTML5, CSS3, React, Ruby on Rails
        </h3>
        <p className="about-content">
I'm a person, musician, and software developer using mostly Javascript and Ruby (and messing around with Lua, Rust, C/C++). I appreciate good UI, responsive designs, well-structured code, and git. I am a team player with a documented knack for staying cool under fire and for going 0 to 60 in new opportunities who loves to work on interesting projects of all kinds.
        </p>
        <p className="about-content">
Using my experience as a luthier and instrument designer I treat my process of building software as building an instrument: something that is both simple & easily discoverable yet rewards deeper interaction & study. In my free time I enjoy coding musical controllers/interfaces for both the browser and various hardware devices.
        </p>
        <p className="about-content">
My other interests include: synthesis/sound/instrument design, iterative processes and generative patterns, Andrei Tarkovsky films, 80-90s alt/indie rock, Boston Celtics basketball, chess, matcha, Camusian restraint-as-rebellion minimalism, balancing free improvisation with intentionality, Rilke, Chris Farley comedies, Bauhausian modernism, the electric guitar + delay pedals, Basho, low-impact kettlebell workouts, skateboarding, techno, and running.
        </p>
        <br />
        <p>contact @ tim [at] bvwtgt [dot] xyz</p>
        <a href="https://github.com/timothy-taylor">Github</a>
        <a href="https://www.linkedin.com/in/timothy-g-taylor">LinkedIn</a>
        <br />
        {isLoggedIn && <Link to={"/user/" + user.id}>hi tim / new post / log out / etc</Link>}
      </main>
      <Footer />
    </>
  );
};

export default About;
