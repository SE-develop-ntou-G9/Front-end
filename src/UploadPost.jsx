import React, { useState } from "react";
import PostClass from "../src/models/PostClass";

function UploadPost() {
  // 初始化 PostClass 實例
  const [post, setPost] = useState(
    new PostClass("", "", "", "", "", false, "")
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost({
      ...post,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 從 localStorage 取得現有的資料陣列
    const existingPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // 將新的 post 加入陣列
    const updatedPosts = [...existingPosts, post];

    // 將更新後的陣列存回 localStorage
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    alert(`資料已儲存到 localStorage：
      出發地: ${post.origin}
      目的地: ${post.destination}
      出發時間: ${post.time}
      集合地點: ${post.meetingPoint}
      備註: ${post.note}
      是否有安全帽: ${post.helmet ? "是" : "否"}
      聯絡方式: ${post.contact}
    `);

    // 清空表單
    setPost(new PostClass("", "", "", "", "", false, ""));
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-[40vw] mx-auto my-4">
      <h1 className="text-2xl font-bold mb-4">上傳貼文</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">出發地:</label>
          <input
            type="text"
            name="origin"
            value={post.origin}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">目的地:</label>
          <input
            type="text"
            name="destination"
            value={post.destination}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">出發時間:</label>
          <input
            type="datetime-local"
            name="time"
            value={post.time}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">集合地點:</label>
          <input
            type="text"
            name="meetingPoint"
            value={post.meetingPoint}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">備註:</label>
          <textarea
            name="note"
            value={post.note}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-2">
            <input
              type="checkbox"
              name="helmet"
              checked={post.helmet}
              onChange={handleChange}
              className="mr-2"
            />
            是否有安全帽
          </label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">聯絡方式:</label>
          <input
            type="text"
            name="contact"
            value={post.contact}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            提交貼文
          </button>
          <button>
            <a href="./" className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 ml-4">
              返回
            </a>
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadPost;