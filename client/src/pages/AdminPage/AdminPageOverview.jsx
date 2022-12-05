import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function AdminPageOverview() {

    return (
        <>
            <div>
                <ul className="d-flex p-5 pr-20">
                    <li className="mr-3"><NavLink end to="" ><b className='text-yellow-600 no-underline'>Tableau de bord</b></NavLink></li>
                    <li className="mr-3"><NavLink to="addrealestate">Ajouter un bien immobilier</NavLink></li>
                    <li className=""><NavLink to="fees">Gestion des frais</NavLink></li>
                </ul>
            </div>

            <div className='p-20'>
                <Outlet />
            </div>
            <div className="card">
                <h2>Tableau de bord</h2>
            </div>
        </>
    );
}