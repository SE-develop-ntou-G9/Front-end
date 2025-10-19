import { HiMenu } from "react-icons/hi"; // Side Bar的import

function Header() {
  return (

    <header className="fixed top-0 left-0 w-full bg-white border-b flex justify-between items-center px-4 py-3 z-10">
      {/* 左邊的選單 */}
      <button className="text-gray-600 text-2xl">
        <HiMenu />
      </button>

      {/* 中間的標題 */}
      <h1 className="text-xl font-bold text-gray-800">NTOUber</h1>

      {/* 右邊的登入登出 */}
      <div>
        <button className="px-3 py-1 bg-black text-white border border-gray-400 rounded-full text-sm hover:bg-gray-100">
          log in
        </button>
        <button className="px-3 py-1 bg-black text-white border border-gray-400 rounded-full text-sm hover:bg-gray-100">
          sign on
        </button>
      </div>

    </header>
  );
}
export default Header;