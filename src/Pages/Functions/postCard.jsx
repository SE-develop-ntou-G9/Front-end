import React from 'react';
import PostClass from '../../models/PostClass';
import { HiArrowRight } from "react-icons/hi";

function postCard({ postData }) {
    if (!postData) return null;
    const tags = ['自備安全帽', '中途下車'];

    return (
        <article className='postCard m-4 w-1/3'>
            <div className = "flex h-24 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                <img src="https://placehold.co/100x50?text=Demo+Image&font=roboto" alt="demo" className="rounded-xl shadow" />
            </div>
            <div className="space-y-3 text-xs">
                {/* 文字或顯示區塊 */}
                {postData.origin} {"→"} {postData.destination}
            </div>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <span
                    key={tag}
                    className="rounded-lg bg-gray-100 px-1.5 py-0.5 text-[8px] font-medium text-gray-700"
                    >
                    {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between text-gray-500">
                {/* 底部資訊或按鈕 */}
            </div>

        </article>
    );
}

export default postCard;