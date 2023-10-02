import "./app.css";
import Banner from "./components/banner/banner";
import CapsuleGrid from "./components/capsule-grid/capsule-grid";
import Header from "./components/header/header";

function App() {
  return (
    <div className="container">
      <Header />
      <Banner />
      <CapsuleGrid />
    </div>
  );
}

export default App;
