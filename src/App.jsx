import Post from "./post";
import PrePost from "./prepost";
function App() {
  return (
    <>
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-1 bg-blue-100 ">
          <h1>Tool</h1>
          <button className="hover:bg-blue-200">發送貼文</button>
        </div>
        <div className="col-span-3 bg-green-100 text-center">
          <h1>Post</h1>
          {/* <Post /> */}
          <a href=""><PrePost /></a>
        </div>
        <div className="col-span-1 bg-yellow-100 ">
          <h1>don't know</h1>
        </div>
    </div>
    </>
  );
}

export default App;

