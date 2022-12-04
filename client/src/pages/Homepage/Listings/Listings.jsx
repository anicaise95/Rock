import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router-dom";

export default function Listings() {

    return (
        <>
            <ul className="d-flex p-20">
                <li className="mr-3"><NavLink end to="" ><b>Catalogue immobilier</b></NavLink></li>
                <li className="mr-3"><NavLink to="/marketplace" >Marketplace</NavLink></li>
                <li className="mr-3"><NavLink to="/profile">Mon compte</NavLink></li>
                <li className=""><NavLink to="/admin">Administration</NavLink></li>
            </ul>
            <div className='p-20'>
                <h2 className='mn-20'>Accés aux listings</h2>
                <Outlet />
            </div>
        </>
    );
}