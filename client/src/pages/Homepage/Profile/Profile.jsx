import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import useEth from "./../../../contexts/EthContext/useEth";

export default function Profile() {

    const { state: { owner, accounts } } = useEth();

    return (
        <>
            <div className="flex-fill container d-flex flex-column p-20">
                <div className={`card flex-fill d-flex flex-column p-20 mb-20 contentCard`}>
                    <div className="card" ></div>

                    <ul className="d-flex p-20">
                        <li className="mr-3"><NavLink to="/listings" >Retour au catalogue immobilier</NavLink></li>
                        <li className="mr-3"><NavLink to="/marketplace" >Marketplace</NavLink></li>
                        <li className="mr-3"><NavLink end to="" ><b>Mon compte</b></NavLink></li>
                        <>
                            {
                                owner == accounts[0] &&
                                <li className=""><NavLink to="/admin">Administration</NavLink></li>
                            }
                        </>
                    </ul>
                    <div className='p-20'>
                        <Outlet />
                    </div>

                </div>
            </div>
        </>
    );
}