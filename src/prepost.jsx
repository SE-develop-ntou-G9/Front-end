function PrePost() {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200 p-6 border border-gray-200">
      {/* Route Information */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 font-semibold">📍</span>
            <span className="text-sm text-gray-500">出發地</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">海大校門口</h3>
        </div>
        <div className="text-2xl text-gray-400">→</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600 font-semibold">📍</span>
            <span className="text-sm text-gray-500">目的地</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">基隆火車站</h3>
        </div>
      </div>

      {/* Trip Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-blue-600">🕐</span>
          <div>
            <span className="text-sm text-gray-500">出發時間</span>
            <p className="font-semibold text-gray-800">2024/06/20 14:00</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-purple-600">📌</span>
          <div>
            <span className="text-sm text-gray-500">集合地點</span>
            <p className="font-semibold text-gray-800">海大圖書館</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-orange-600">📞</span>
          <div>
            <span className="text-sm text-gray-500">聯絡方式</span>
            <p className="font-semibold text-gray-800">0912345678</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PrePost;