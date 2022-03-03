import "./App.css";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
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
import PostAPI from "./api/post";
import UserAPI from "./api/user";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [user, setUser] = useAtom(userAtom);
  const [theme] = useAtom(themeAtom);
  const [posts, setPosts] = React.useState([]);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser({});
  };

  React.useEffect(() => {
    setPosts(PostAPI.getPosts());

    const status = UserAPI.loginStatus();
    if (status.logged_in) {
      handleLogin(status)
    } else {
      handleLogout();
    }
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
          <QueryClientProvider client={queryClient}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/user/:id" element={<User />} />
            <Route
              exact
              path="/login"
              element={
                <Login handleLogin={handleLogin} handleLogout={handleLogout} />
              }
            />
            <Route exact path="/about" element={<About />} />
            <Route exact path="/post/:id" element={<Post />} />
            <Route exact path="/writing" element={<Writing posts={posts} />} />
            <Route path="*" element={<NotFound />} />
          </QueryClientProvider>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
