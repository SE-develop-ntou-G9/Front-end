import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrePost from "./Pages/Functions/prepost";
import UploadPost from "./Pages/Functions/UploadPost";
import PostClass from './models/PostClass';
import UserPage from "./Pages/UserPage";
import GuestPage from "./Pages/GuestPage";
import { HiSearch } from "react-icons/hi"; // 圖示的韓式庫

function App() {
  const [posts, setPosts] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(storedPosts);
  }, []);

  const deletePost = () => {
    setPosts([]);
    localStorage.removeItem("posts");
  }

  return (
    <>
      <Router>

        <Routes>
          {isLoggedIn ? (
            <Route
              path="/*"
              element={<UserPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}
            />
          ) : (
            <Route
              path="/*"
              element={<GuestPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}
            />
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;

