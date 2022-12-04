import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router-dom";

export default function Profile() {

    return (
        <>
            <ul className="d-flex p-20">
                <li className="mr-3"><NavLink to="/listings" >Retour au catalogue immobilier</NavLink></li>
                <li className="mr-3"><NavLink to="/marketplace" >Marketplace</NavLink></li>
                <li className="mr-3"><NavLink end to="" ><b>Mon compte</b></NavLink></li>
                <li className=""><NavLink to="/admin">Administration</NavLink></li>
            </ul>
            <div className='p-20'>
                <Outlet />
            </div>
        </>
    );
}