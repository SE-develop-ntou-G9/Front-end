import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrePost from "./Pages/Functions/prepost";
import UploadPost from "./Pages/Functions/UploadPost";
import PostClass from './models/PostClass';
import { HiSearch } from "react-icons/hi"; // 圖示的韓式庫

function App() {
  const [posts, setPosts] = useState([]);

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
        {/* 預設彈性，大螢幕(md)換grid */}
        <div className="flex flex-col md:grid md:grid-cols-5 md:h-screen">
          <div className="col-span-1 bg-blue-100 ">
            <h1>Tool</h1>
            <Link to="/upload" className="text-blue-500 hover:underline">
              上傳貼文
            </Link>
          </div>
          <div className="col-span-3 bg-green-100 text-center">
            <h1>Post</h1>
            <Routes>
              <Route path="/" element={<div>
                <button className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={deletePost}>清空貼文</button>
                {posts.map((post, index) => (
                  <PrePost key={index} {...post} />
                ))}
              </div>} />
              <Route path="/upload" element={<UploadPost />} />
            </Routes>
          </div>
          <div className="col-span-1 bg-yellow-100 ">
            <h1>don't know</h1>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;

