import { Link } from "react-router-dom";
import { useAtom } from "jotai";
import { userAtom, isLoggedInAtom } from "../Atoms";

const About = () => {
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  return (
    <>
      <h1>Frontend leaning Fullstack developer</h1>
      {isLoggedIn && <Link to={"/user/" + user.id}>{user.email}</Link>}
      <br />
      <Link to="/login">Log In/out</Link>
    </>
  );
};

export default About;
