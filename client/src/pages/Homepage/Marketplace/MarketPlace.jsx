import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router-dom";

export default function MarketPlace() {

    return (
        <>
            <ul className="d-flex p-20">
                <li className="mr-3"><NavLink to="/listings" >Catalogue immobilier</NavLink></li>
                <li className="mr-3"><NavLink end to="" ><b>Marketplace</b></NavLink></li>
                <li className="mr-3"><NavLink to="/profile">Mon compte</NavLink></li>
                <li className=""><NavLink to="/admin">Administration</NavLink></li>
            </ul>
            <div className='p-20'>
                <Outlet />
            </div>
        </>
    );
}