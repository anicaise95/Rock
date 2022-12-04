import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router-dom";

export default function AdminPage() {

    return (
        <>
            <div className="flex-fill container d-flex flex-column p-20">
                <div className={`card flex-fill d-flex flex-column p-20 mb-20 contentCard`}>
                    <div className="card" >

                        <div>
                            <ul className="d-flex p-20">
                                <li className="mr-3"><NavLink end to="/listings" >Retour au catalogue immobilier</NavLink></li>
                                <li className="mr-3"><NavLink end to="" ><b>Administration</b></NavLink></li>
                                <li className="mr-3"><NavLink to="addrealestate">Ajouter un bien immobilier</NavLink></li>
                                <li className=""><NavLink to="fees">Gestion des frais</NavLink></li>
                            </ul>
                        </div>
                        <div>
                            <ul className="d-flex p-20">
                                <li className="mr-3"><NavLink end to="" ><b>Tableau de bord</b></NavLink></li>
                                <li className="mr-3"><NavLink to="addrealestate">Ajouter un bien immobilier</NavLink></li>
                                <li className=""><NavLink to="fees">Gestion des frais</NavLink></li>
                            </ul>
                        </div>

                        <div className='p-20'>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}