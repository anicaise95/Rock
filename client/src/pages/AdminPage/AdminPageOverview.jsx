import React, { useEffect, useState, useParams } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useEth from "../../contexts/EthContext/useEth";
import { Outlet } from 'react-router-dom';
import RealEstateView from '../Homepage/components/RealEstateView';

export default function AdminPageOverview() {
    const { state: { contract, accounts, web3 } } = useEth();

    const [realEstateArray, setRealEstateArray] = useState([]);
    const [realEstateCount, setRealEstateCount] = useState([]);
    const [cards, setCards] = useState([]);

    const action = "minter";

    useEffect(() => {
        if (contract != null) {
            fetchRealEstatesCollection();
            fetchCards();
        }
    }, [contract, realEstateCount]);

    async function fetchRealEstatesCollection() {
        try {
            // On recupére le nombre d'élements dans le tableau
            const count = await contract.methods.getRealEstatesCollectionCount().call({ from: accounts[0] });
            setRealEstateCount(count);
            console.log("Nombre de biens immobiliers : " + count);

            const realEstateArray = Array();
            for (let index = 0; index < count; index++) {
                realEstateArray.push(await contract.methods.realEstatesCollection(index).call({ from: accounts[0] }));
            }
            console.log("Liste des biens immobiliers : " + realEstateArray);
            setRealEstateArray(realEstateArray);
        } catch (error) {
            alert(error);
        }
    };

    async function fetchCards() {
        try {
            const cardsArray = Array();
            for (let index = 0; index < realEstateCount; index++) {
                cardsArray.push(await contract.methods.getCards(index).call({ from: accounts[0] }));
            }
            setCards(cardsArray);
            console.log("cardsArray : " + cardsArray);
            console.log("cardsArray[0][0].numberOfTokens : " + cardsArray[0][0].numberOfTokens);


        } catch (error) {
            //alert(error);
        }
    };

    return (
        <>
            <div>
                <ul className="d-flex">
                    <li className="mr-3"><NavLink end to="" ><b className='text-yellow-600 no-underline'>Tableau de bord</b></NavLink></li>
                    <li className="mr-3"><NavLink to="addrealestate">Ajouter un bien immobilier</NavLink></li>
                    <li className=""><NavLink to="fees">Gestion des frais</NavLink></li>
                </ul>
            </div>

            <Outlet />

            <div class="card">
                <div className='d-flex text-lg text-cyan-900 align-content-end justify-content-end pt-50'><b>{realEstateCount}  bien(s) immobilier(s)</b> actuellement géré(s) par ROCK</div>
                <div class="grid">
                    <>
                        {
                            realEstateArray.map((realEstate, index) => {
                                return (
                                    <>
                                        {
                                            index >= 0 &&
                                            <div key={index} class="col-4 p-3">
                                                <RealEstateView realEstate={realEstate} buttonAction={action} cards={cards} />
                                            </div>
                                        }
                                    </>
                                )
                            })
                        }
                    </>
                </div>
            </div>
        </>
    );
}