import { Button } from 'primereact/button';
import { NavLink } from "react-router-dom";
import NICEview from "../../../asset/images/realsrestates/NICE_petit.JPG";
import { Card } from 'primereact/card';

export default function ListingsOverview() {

    const id = 1;

    return (
        <>
            <div className="card">
                <h2>Accès aux listings</h2>
            </div>
            <div className="flex-fill container d-flex flex-column p-20">
                <div className={`card flex-fill d-flex flex-column p-20 mb-20 contentCard`}>
                    <div className="card" >

                        <div className="flex flex-column card-container white-container">

                            <div className="flex align-items-center bg-white justify-content-center h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">
                                <div class="card">
                                    <div class="flex card-container blue-container overflow-hidden">
                                        <div class="flex-none flex align-items-start justify-content-start bg-white-500 font-bold text-white m-2 px-5 py-3 border-round">
                                            <img src={NICEview} alt="schema" />
                                        </div>
                                        <div class="flex-none w-32rem flex align-items-center justify-content-center font-bold text-white m-2 px-5 py-3 border-round">
                                            <Card>
                                                <div className='text-yellow-500 text-xl'>
                                                    GRASSE - 1 120 000 €
                                                </div>
                                                <div className='text-yellow-800 pt-2'>
                                                    Magnifique Villa de prestige en bord de mer
                                                </div>
                                                <div className='text-yellow-500 pt-4'>
                                                    <NavLink to={`view/${id}`}>
                                                        Votre NFT à partir de 50 €
                                                    </NavLink>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex align-items-start bg-white justify-content-start h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">
                                <div class="card">
                                    <div class="flex card-container blue-container overflow-hidden">
                                        <div class="flex-none flex align-items-start justify-content-start bg-white-500 font-bold text-white m-2 px-5 py-3 border-round">
                                            <img src={NICEview} alt="schema" />
                                        </div>
                                        <div class="flex-none w-32rem flex align-items-center justify-content-center font-bold text-white m-2 px-5 py-3 border-round">
                                            <Card>
                                                <div className='text-yellow-500 text-xl'>
                                                    NICE - 1 120 000 €
                                                </div>
                                                <div className='text-yellow-800 pt-2'>
                                                    Magnifique Villa de prestige en bord de mer
                                                </div>
                                                <div className='text-yellow-500 pt-4'>
                                                    Investissez en token à partir de 50 €
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex align-items-center bg-white justify-content-center h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}