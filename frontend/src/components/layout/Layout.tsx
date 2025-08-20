import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="pt-[60px]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;