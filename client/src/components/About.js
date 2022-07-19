import Layout from "./Layout";

export default function About() {
  return (
    <Layout active="About">
      <main id="main-content">
        <h2>Hi, I'm Tim.</h2>
        <h3>
          Software Developer | Frontend + Fullstack | Javascript, HTML5, CSS3,
          React, Ruby on Rails
        </h3>
        <p className="about-content">
          I'm a software developer using mostly Javascript and Ruby (with a bit
          exploring with Lua, Rust, C/C++). I care about accessibility, good UI,
          and responsive designs.
        </p>
        <p className="about-content">
          I'm also a generalist, musician, and a team player who enjoys
          improvisation, learning, and uncovering hidden assumptions and
          expectations so everyone can be on the same page.
        </p>
        <p className="about-content">
          Using my experience as a luthier and instrument designer I treat my
          process of creating software as the building of an instrument: making
          something that is both simple and easily discoverable yet rewards
          deeper interaction and study. In my free time I enjoy coding musical
          controllers and interfaces for both the browser and various hardware
          devices. Happy to chat about any of the following:
        </p>
        <div className="about-content">
          <ul>
            <li>synthesis / sound / instrument design</li>
            <li>chess</li>
            <li>skateboarding</li>
            <li>electric guitar</li>
            <li>
              carving out space and energy to live and have a sustainable career
              as an agoraphobic
            </li>
            <li>Andrei Tarkovsky films</li>
            <li>Rilke, Hesse, Nabakov, Camus, etc</li>
            <li>Bauhausian modernism</li>
            <li>Camusian restraint as rebellion minimalism</li>
            <li>iterative processes and generative patterns</li>
            <li>grounding rhymth</li>
            <li>I Ching</li>
            <li>tea and espresso</li>
            <li>the Boston Celtics</li>
            <li>morning workouts</li>
            <li>balancing free improvisation with intentionality</li>
          </ul>
        </div>
        <a href="https://www.linkedin.com/in/timothy-g-taylor">LinkedIn</a>
        <a href="https://github.com/timothy-taylor">Github</a>
        <a href="https://tgtmusic.bandcamp.com/">Bandcamp</a>
        <a href="https://open.spotify.com/artist/5pJDAJfpQWFQJVOB16Gx70?si=XUQiPH22QduDUyMmuIjV6g">
          Spotify
        </a>
      </main>
    </Layout>
  );
}
