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
    alert(`輸入的資料如下：
      出發地: ${post.origin}
      目的地: ${post.destination}
      出發時間: ${post.time}
      集合地點: ${post.meetingPoint}
      備註: ${post.note}
      是否有安全帽: ${post.helmet ? "是" : "否"}
      聯絡方式: ${post.contact}
    `);
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
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          提交貼文
        </button>
      </form>
    </div>
  );
}

export default UploadPost;