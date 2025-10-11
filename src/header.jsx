function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏍️</span>
            <div>
              <h1 className="text-2xl font-bold">海大機車共乘系統</h1>
              <p className="text-sm text-blue-100">安全、便利、環保的校園共乘平台</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <a href="#" className="hover:text-blue-200 transition duration-200">首頁</a>
            <a href="#" className="hover:text-blue-200 transition duration-200">關於</a>
            <a href="#" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition duration-200">登入</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
export default Header;