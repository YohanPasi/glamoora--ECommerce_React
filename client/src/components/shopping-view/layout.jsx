import { Outlet } from "react-router-dom";
import ShopingHeader from "./header";

function ShoppingLayout(){
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            {/*Common header*/}
            <ShopingHeader/>
            <main className="flex flex-col w-full">
                <Outlet/>
            </main>
        </div>

    );
};

export default ShoppingLayout;