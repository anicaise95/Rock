import { useEffect } from "react";
import { Button } from 'primereact/button';
import { NavLink } from "react-router-dom";
//import styles from "./Homepage.module.scss";
import schema from "../../asset/images/schema.png";

export default function Homepage() {

    const handleButtonListingsClick = async e => {

    };

    useEffect(() => {
    }, []);

    return (
        <div className="flex-fill container d-flex flex-column p-20">
            <div className={`card flex-fill d-flex flex-column p-20 mb-20 contentCard`}>
                <div className="card" >

                    <div className="flex align-items-center bg-white justify-content-center h-15rem bg-pink-400 font-bold text-black border-pink-100 hover:border-700 border-3">
                        NOTRE MISSION


                    </div>

                    <div>
                        <img src={schema} alt="schema" />
                    </div>

                    <div class="flex card-container white-container overflow-hidden">
                        <div class="flex-none flex align-items-center justify-content-center bg-white-500 font-bold text-white m-2 px-5 py-3 border-round"></div>
                        <div class="flex-grow-1 flex align-items-center justify-content-center bg-white-500 font-bold text-white m-2 px-5 py-3 border-round">
                            <NavLink to="listings">
                                <p class="text-xl font-bold">Voir nos biens immobiliers</p>
                            </NavLink>
                        </div>
                        <div class="flex-none flex align-items-center justify-content-center bg-white-500 font-bold text-white m-2 px-5 py-3 border-round"></div>
                    </div>

                </div>
            </div>
        </div>
    );
}