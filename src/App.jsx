import PrePost from "./prepost";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-12 gap-6 max-w-7xl mx-auto p-6">
        {/* Left Sidebar - Tools */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">功能選單</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-sm hover:shadow-md">
                發送貼文
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200">
                我的貼文
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200">
                搜尋行程
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area - Posts */}
        <main className="col-span-12 md:col-span-9 lg:col-span-7">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">最新共乘貼文</h2>
            <p className="text-gray-600">瀏覽所有可用的共乘機會</p>
          </div>
          <div className="space-y-4">
            <a href="" className="block hover:transform hover:scale-[1.02] transition duration-200">
              <PrePost />
            </a>
            <a href="" className="block hover:transform hover:scale-[1.02] transition duration-200">
              <PrePost />
            </a>
          </div>
        </main>

        {/* Right Sidebar - Info */}
        <aside className="col-span-12 lg:col-span-3 hidden lg:block">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">使用說明</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="pb-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1">如何發布</h3>
                <p>點擊「發送貼文」填寫行程資訊並發布</p>
              </div>
              <div className="pb-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-1">如何參加</h3>
                <p>瀏覽貼文並點擊「發送請求」聯絡發布者</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">注意事項</h3>
                <p>請確保行程時間正確並準時到達集合地點</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;

