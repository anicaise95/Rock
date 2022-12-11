import { Outlet } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import { useState } from "react";
import useEth from "./../../contexts/EthContext/useEth";

export default function AdminPage() {

    const { state: { owner, accounts } } = useEth();

    return (
        <>
            {
                <div className="flex-fill container d-flex flex-column p-20">
                    <div className={`card flex-fill d-flex flex-column p-20 mb-20 contentCard`}>
                        <div className="card" >

                            <div>
                                <ul className="d-flex pt-20">
                                    <li className="mr-3"><NavLink end to="/listings" >Catalogue immobilier</NavLink></li>
                                    <>
                                        {
                                            owner == accounts[0] &&
                                            <li className="mr-3"><NavLink end to="" ><b>Administration</b></NavLink></li>
                                        }
                                    </>
                                </ul>
                            </div>

                            <div>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}