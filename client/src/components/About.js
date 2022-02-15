import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom, isLoggedInAtom } from "../Atoms";
import Header from "./Header";

const About = () => {
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <>
    <Header active="About" />
    <main>
      <h2>Hi, I'm Tim.</h2>
      <p>Frontend leaning fullstack developer</p>
      {isLoggedIn && <Link to={"/user/" + user.id}>{user.email}</Link>}
      <br />
      {isLoggedIn && <Link to="/login">log in / log out / new post</Link>}
    </main>
    </>
  );
};

export default About;
