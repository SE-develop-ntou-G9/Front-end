import React, { useEffect, useState } from "react";
import { useNavigate, BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrePost from "./Pages/Functions/prepost";
import UploadPost from "./Pages/Functions/UploadPost";
import PostClass from './models/PostClass';
import Header from "./header.jsx";
import UserPage from "./Pages/UserPage";
import GuestPage from "./Pages/GuestPage";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import { HiSearch } from "react-icons/hi"; // 圖示的韓式庫
import PostCard from "./Pages/Functions/PostCard"
import ProfilePage from "./Pages/ProfilePage.jsx";
import DetailPost from "./Pages/Functions/DetailPost.jsx";
import EditProfilePage from "./Pages/EditProfilePage.jsx";


function App() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //登入的State
  const [userRole, setUserRole] = useState(null); //身分的Steate

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    async function checkRole() {
      try {
        const res = await fetch(`https://ntouber-user.zeabur.app/v1/drivers/user/${user.ID}`);
        if (res.ok) {
          localStorage.setItem("userRole", "車主");
          setUserRole("車主");
        } else {
          localStorage.setItem("userRole", "乘客");
          setUserRole("乘客");
        }
      } catch (err) {
        console.error(err);
      }
    }

    checkRole();
  }, [isLoggedIn]); // 🔥 只要登入成功就會跑一次


  //我獨自升級 
  const toggleRole = () => {
    //測試用
    if (userRole === "車主") {
      const newRole = "乘客";
      setUserRole(newRole);
      localStorage.setItem("userRole", newRole);
      return;
    };

    if (!isLoggedIn) return;
    if (userRole === "車主") return;

    const newRole = "車主";
    setUserRole(newRole);
    localStorage.setItem("userRole", newRole);
  };


  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
  };


  const deletePost = () => {
    setPosts([]);
    localStorage.removeItem("posts");
  }

  return (
    <>
      <Router>
        {/* 傳是否登入給Header */}
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          userRole={userRole}
          toggleRole={toggleRole}
        />

        {/* 把上面的標題固定，不會往下滑就不見 */}
        <div className="pt-12">
          <Routes>

            <Route path="/login" element={<LogInPage setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} /> {/*導到LogInPage */}
            <Route path="/Regist" element={<RegisterPage toggleRole={toggleRole} />} />
            <Route path="/Profile"
              element={
                <ProfilePage
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                  userRole={userRole}
                  setUserRole={setUserRole}
                />
              }
            />
            <Route path="/uploadPost" element={<UploadPost />} />
            <Route path="/EditProfile" element={<EditProfilePage />} />
            <Route path="/detailPost" element={<DetailPost isLoggedIn={isLoggedIn} />} />

            {isLoggedIn ? (
              <Route
                path="/*"
                element={<UserPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} userRole={userRole} />} />
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