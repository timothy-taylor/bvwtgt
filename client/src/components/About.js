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
      <main>
        <h2>Hi, I'm Tim.</h2>
        <h3>
          Software Developer | Frontend + Fullstack | Javascript, HTML5, CSS3, React, Ruby on Rails
        </h3>
        <p class="about-content">
I'm a software developer using mostly Javascript and Ruby. I appreciate good UI, responsive designs, well-structured code, and git. I am a team player with a documented knack for going 0 to 60 in new opportunities who loves to work on interesting projects of all kinds.
        </p>
        <p class="about-content">
Using my experience as a luthier and instrument designer I treat my process of building software as building an instrument: something that is both simple & easily discoverable yet rewards deeper interaction & study. In my free time I enjoy coding musical controllers/interfaces for both the browser and various hardware devices.
        </p>
        <br />
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
