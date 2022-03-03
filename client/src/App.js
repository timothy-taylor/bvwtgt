import "./App.css";
import React from "react";
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
import UserAPI from "./api/user";

const App = () => {
  // Atoms are global state
  const [setIsLoggedIn] = useAtom(isLoggedInAtom).reverse();
  const [setUser] = useAtom(userAtom).reverse();
  const [theme] = useAtom(themeAtom);

  const handleLogin = React.useCallback(
    (data) => {
      setIsLoggedIn(true);
      setUser(data.user);
    },
    [setIsLoggedIn, setUser]
  );

  const handleLogout = React.useCallback(() => {
    setIsLoggedIn(false);
    setUser({});
  }, [setIsLoggedIn, setUser]);

  React.useEffect(() => {
    const getAndSetLogin = async () => {
      const userData = await UserAPI.loginStatus();

      if (userData?.logged_in) {
        handleLogin(userData);
      } else {
        handleLogout();
      }
    };

    getAndSetLogin();
  }, [handleLogin, handleLogout]);

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
          <Route exact path="/about" element={<About />} />
          <Route exact path="/post/:id" element={<Post />} />
          <Route exact path="/writing" element={<Writing />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
