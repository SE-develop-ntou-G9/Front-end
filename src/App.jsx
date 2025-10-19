import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrePost from "./Pages/Functions/prepost";
import UploadPost from "./Pages/Functions/UploadPost";
import PostClass from './models/PostClass';
import Header from "./header.jsx";
import UserPage from "./Pages/UserPage";
import GuestPage from "./Pages/GuestPage";
import { HiSearch } from "react-icons/hi"; // 圖示的韓式庫
import PostCard from "./Pages/Functions/PostCard"

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
        {/* 傳是否登入給Header */}
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        {/* 把上面的標題固定，不會往下滑就不見 */}
        <div className="pt-14">
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
        </div>
      </Router>
    </>
  );
}

export default App;

