import React from 'react';

function Post() {
  return (
    <div className="col-span-3 bg-white text-left p-4 rounded shadow-md h-[30vh] w-[40vw] mx-auto">
        <div className="mb-4">
            <h1>From 海大校門口</h1>
            <h1>To 基隆火車站</h1>
        </div>
        <div className="mb-4">
            <h1>王曉明 </h1>
            <h1>時間: 2024/06/20 14:00</h1>
            <h1>集合地: 海大圖書館</h1>
            <h1>聯絡方式: 0912345678</h1>
            <h1>有沒有安全帽: 有</h1>
            <h1>備註: 我會帶一點零食</h1>
        </div>
        <button className="bg-amber-200">發送請求</button>
        <a href="./"><button className="bg-amber-200">返回</button></a>
    </div>
  );
}
export default Post;