import SidebarRoutes from "./SidebarRoutes";

const Sidebar = () => {
  return (
    <div className="h-[calc(100vh-5rem)] border-r border-slate-200 flex flex-col overflow-y-auto bg-white">
      <div className="p-6 flex-col w-full">
        <SidebarRoutes/>


      </div>
    </div>
  );
};

export default Sidebar;
