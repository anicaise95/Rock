import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

export default function AdminPageFees() {

    return (
        <>
            <div>
                <ul className="d-flex p-5 pr-20">
                    <li className="mr-3"><NavLink end to="" >Tableau de bord</NavLink></li>
                    <li className="mr-3"><NavLink to="/admin/addrealestate">Ajouter un bien immobilier</NavLink></li>
                    <li className=""><NavLink to="/admin/fees"><b className='text-yellow-600 no-underline'>Gestion des frais</b></NavLink></li>
                </ul>
            </div>

            <div className='p-20'>
                <Outlet />
            </div>
            <div className="card">
                <h2>Configuration des frais de la plateforme</h2>
            </div>
            <div>
                <span className='font-bold text-white'>
                    Cette fonctionnalité n'est malheureusement pas implémentée pour le moment :(
                </span>
            </div>
        </>
    );
}
