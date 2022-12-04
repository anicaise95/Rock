import { Button } from 'primereact/button';
import { NavLink } from "react-router-dom";

export default function ListingsOverview() {

    const id = 1;

    return (
        <div className="card">
            <div className="flex flex-column card-container white-container">
                <div className="flex align-items-center bg-white justify-content-center h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">
                    <NavLink to={`view/${id}`}>
                        <Button label="En savoir plus" className="p-button-raised p-button-rounded align-content-center" />
                    </NavLink>
                </div>
                <div className="flex align-items-center bg-white justify-content-center h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">
                    2
                </div>
                <div className="flex align-items-center bg-white justify-content-center h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">
                    3
                </div>
            </div>
        </div>
    );
}