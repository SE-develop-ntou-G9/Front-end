import React, { useState } from 'react';
import { HiChevronDoubleRight } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi";
function PrePost() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded ? (
        <div className="col-span-3 bg-white text-left p-4 rounded shadow-md h-[45vh] w-[40vw] mx-auto my-4">
          <div className="mb-4">
            <h1 className='text-3xl font-bold inline-flex items-center'>海大校門口 <HiArrowRight /> 基隆火車站</h1>
            <h1>時間: 2024/06/20 14:00</h1>
          </div>
          <div className="mb-2">
            <h1>集合地: 海大圖書館</h1>
            <h1>聯絡方式: 0912345678</h1>
            <h1>有沒有安全帽: 有</h1>
            <h1>備註: 我會帶一點零食</h1>
          </div>
          <button 
            onClick={toggleContent} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isExpanded ? '收起內容' : '查看更多'}
          </button>
        </div>
      ) : (
        <div className="col-span-3 bg-white text-left p-4 rounded shadow-md h-[30vh] w-[40vw] mx-auto my-4">
          <div className="mb-4">
            <h1 className='text-3xl font-bold inline-flex items-center'>海大校門口 <HiArrowRight /> 基隆火車站</h1>
            <h1>時間: 2024/06/20 14:00</h1>
          </div>
          <p className="text-gray-500">點擊下方按鈕查看詳細內容...</p>
          <button 
            onClick={toggleContent} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isExpanded ? '收起內容' : '查看更多'}
          </button>
        </div>
      )}
    </>
  );
}

export default PrePost;