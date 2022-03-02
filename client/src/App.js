import './App.css';
import React from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAtom } from "jotai";
import Home from "./components/Home";
import Login from "./components/Login";
import Post from "./components/Post";
import User from "./components/User";
import About from "./components/About";
import Writing from "./components/Writing";
import NotFound from "./NotFound";
import { isLoggedInAtom, userAtom, themeAtom } from "./Atoms";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [user, setUser] = useAtom(userAtom);
  const [theme, setTheme] = useAtom(themeAtom);
  const [posts, setPosts] = React.useState([]);
  const timeoutAxios = axios.create({ timeout: 1000 });

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({});
  };

  const loginStatus = () => {
    timeoutAxios
      .get("/api/logged_in", { withCredentials: true })
      .then((response) => {
        if (response.data.logged_in) {
          handleLogin(response.data);
        } else {
          handleLogout();
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  const getPosts = () => {
    timeoutAxios
      .get("/api/posts")
      .then((response) => setPosts(response.data))
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    getPosts();
    loginStatus();
  }, []);

  React.useEffect(() => {
    if (theme === "light") {
      document.body.classList.remove("dark-theme");
    } else if (theme === "dark") {
      document.body.classList.add("dark-theme");
    }
  }, [theme]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/user/:id" element={<User />} />
          <Route
            exact
            path="/login"
            element={
              <Login handleLogin={handleLogin} handleLogout={handleLogout} />
            }
          />
          <Route exact path="/post/:id" element={<Post />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/writing" element={<Writing posts={posts} />} />
          <Route path="*" element={<NotFound />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
