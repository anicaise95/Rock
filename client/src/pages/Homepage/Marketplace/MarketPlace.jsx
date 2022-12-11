import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import useEth from "./../../../contexts/EthContext/useEth";

export default function MarketPlace() {

    const { state: { accounts, owner } } = useEth();

    return (
        <>
            <div className="flex-fill container d-flex flex-column p-20">
                <div className={`card flex-fill d-flex flex-column p-20 mb-20 contentCard`}>
                    <div className="card" >

                        <ul className="d-flex p-20">
                            <li className="mr-3"><NavLink to="/listings" >Catalogue immobilier</NavLink></li>
                            <li className="mr-3"><NavLink end to="" ><b>Marketplace</b></NavLink></li>
                            <li className="mr-3"><NavLink to="/profile">Mon compte</NavLink></li>
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
            </div>
        </>
    );
}