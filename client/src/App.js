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
  // Atoms are global state
  const [setIsLoggedIn] = useAtom(isLoggedInAtom).reverse();
  const [setUser] = useAtom(userAtom).reverse();
  const [theme] = useAtom(themeAtom);

  // grabbing the post titles ahead of time
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
    if (theme === "light") {
      document.body.classList.remove("dark-theme");
    } else if (theme === "dark") {
      document.body.classList.add("dark-theme");
    }
  }, [theme]);

  React.useEffect(() => {
    const handleFetches = async () => {
      const dataUser = await UserAPI.loginStatus();
      const dataPosts = await PostAPI.getPosts();
      setPosts(dataPosts);
      if (dataUser.logged_in) {
        handleLogin(dataUser);
      } else {
        handleLogout();
      }
    };

    handleFetches();
  }, []);

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
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
            <Route exact path="/about" element={<About />} />
            <Route exact path="/post/:id" element={<Post />} />
            <Route exact path="/writing" element={<Writing posts={posts} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
};

export default App;
