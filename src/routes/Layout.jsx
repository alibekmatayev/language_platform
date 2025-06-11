import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Footer from "../components/navigation/Footer";

export default function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
