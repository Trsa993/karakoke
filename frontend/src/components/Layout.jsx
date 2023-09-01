import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const Layout = () => {
  return (
    <div className="font-mono">
      <nav className="sticky top-0 z-10">
        <Navigation />
      </nav>
      <main className="bg-slate-600 flex flex-col items-center p-2 -sm:p-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
