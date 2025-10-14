import Post from "./post";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PrePost from "./prepost";
import UploadPost from "./UploadPost";
// import PostClass from "PostClass";

function App() {
  // const postData = PostClass; // 使用從 PostClass 匯入的資料

  return (
    <>
      <Router>
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-1 bg-blue-100 ">
          <h1>Tool</h1>
          {/* 使用 Link 替代 a */}
          <Link to="/upload" className="text-blue-500 hover:underline">
            上傳貼文
          </Link>
          <button className="hover:bg-blue-200">發送貼文</button>
        </div>
        <div className="col-span-3 bg-green-100 text-center">
          <h1>Post</h1>
          <Routes>
            {/* 定義路由 */}
            <Route path="/" element={<div><PrePost /><PrePost /></div>} />
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

