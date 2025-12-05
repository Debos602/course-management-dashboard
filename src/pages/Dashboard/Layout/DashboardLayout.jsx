import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Dashbar from "../Dashbar/Dashbar";

const AdminsDashboard = () => {
    return (
        <div className="flex wrap">
            <Sidebar />
            <div
                className=" w-[calc(100%-300px)] grow bg-gray-100 text-amber-950
        dark:bg-gray-900 dark:text-white"
            >
                <Dashbar />
                <main className="">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminsDashboard;
