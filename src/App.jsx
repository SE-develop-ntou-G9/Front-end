import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadPost from "./Pages/Functions/UploadPost";
import Header from "./header.jsx";
import UserPage from "./Pages/UserPage";
import GuestPage from "./Pages/GuestPage";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage.jsx";
import DetailPost from "./Pages/Functions/DetailPost.jsx";
import EditProfilePage from "./Pages/EditProfilePage.jsx";
import AdminPage from "./Pages/AdminPage";
import AdminUsers from "./Pages/AdminUsers";
import AdminDrivers from "./Pages/AdminDrivers";
import AdminRegistDrivers from "./Pages/AdminRegistDrivers";

import { useUser } from "./contexts/UserContext.jsx";

function App() {
  const { isLoggedIn, userRole, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="pt-12">
        <Routes>
          <Route path="/login" element={<LogInPage />} />
          <Route path="/Regist" element={<RegisterPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/uploadPost" element={<UploadPost />} />
          <Route path="/EditProfile" element={<EditProfilePage />} />
          <Route path="/detailPost" element={<DetailPost />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/drivers" element={<AdminDrivers />} />
          <Route path="/admin/RegistDrivers" element={<AdminRegistDrivers />} />


          {isLoggedIn ? (
            <Route path="/*" element={<UserPage />} />
          ) : (
            <Route path="/*" element={<GuestPage />} />
          )}
        </Routes>
      </div>
    </>
  );
}

export default App;
