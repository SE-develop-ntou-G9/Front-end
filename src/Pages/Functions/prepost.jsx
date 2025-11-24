import React, { useState } from 'react';
import { HiChevronDoubleRight } from "react-icons/hi";
import { HiArrowRight } from "react-icons/hi";
import PostClass from '../../models/PostClass';
import { format } from "date-fns";

function PrePost(PostData = PostClass) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded ? (
        <div className="col-span-3 bg-white text-left p-4 rounded shadow-md h-[30vh] w-[40vw] mx-auto my-4">
          <div className="mb-4">
            <h1 className='text-3xl font-bold inline-flex items-center'>{PostData.origin} <HiArrowRight /> {PostData.destination}</h1>
            <h1>時間: {format(new Date(PostData.time), "yyyy/MM/dd HH:mm")}</h1>
          </div>
          <div className="mb-2">
            <h1>集合地: {PostData.meetingPoint}</h1>
            <h1>聯絡方式: {PostData.contact}</h1>
            <h1>有沒有安全帽: {PostData.helmet ? "有" : "沒有"}</h1>
            <h1>備註: {PostData.note}</h1>
          </div>
          <button
            onClick={toggleContent}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {isExpanded ? '收起內容' : '查看更多'}
          </button>
        </div>
      ) : (
        <div className="col-span-3 bg-white text-left p-4 rounded shadow-md h-[20vh] w-[40vw] mx-auto my-4">
          <div className="mb-4">
            <h1 className='text-3xl font-bold inline-flex items-center'>{PostData.origin} <HiArrowRight /> {PostData.destination}</h1>
            <h1>時間: {format(new Date(PostData.time), "yyyy/MM/dd HH:mm")}</h1>
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