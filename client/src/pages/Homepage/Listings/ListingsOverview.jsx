import React, { useEffect, useState, useParams } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import useEth from "../../../contexts/EthContext/useEth";
import RealEstateView from '../../Homepage/components/RealEstateView';

export default function ListingsOverview() {

    const { state: { contract, accounts, web3, owner } } = useEth();

    const [realEstateArray, setRealEstateArray] = useState([]);
    const [realEstateCount, setRealEstateCount] = useState([]);
    const [mintedRealEstateCount, setMintedRealEstateCount] = useState(0);

    const [infosCards, setInfosCards] = useState({});
    const [uri, setURI] = useState([]);
    const [isRealEstateMinted, setIsRealEstateMinted] = useState(false);

    const action = "consulter";

    useEffect(() => {
        if (contract != null) {
            fetchRealEstatesCollection();
        }
    }, [realEstateCount]);

    async function fetchRealEstatesCollection() {
        try {
            // On recupére le nombre d'élements dans le tableau
            const count = await contract.methods.getRealEstatesCollectionCount().call({ from: accounts[0] });
            setRealEstateCount(count);
            console.log("Nombre de biens immobiliers gérés par ROCK : " + count);

            const realEstateArray = Array();
            const isRealEstateMinted = Array();
            setIsRealEstateMinted(isRealEstateMinted);
            for (let index = 0; index < count; index++) {
                realEstateArray.push(await contract.methods.realEstatesCollection(index).call({ from: accounts[0] }));
                // Liste des biens mintés (pour les afficher)
                fetchCard(index);
            }
            console.log("Liste des biens immobiliers : " + realEstateArray);
            setRealEstateArray(realEstateArray);
        } catch (error) {
            // alert(error);
        }
    };

    // Récupération des informations sur les cartes NFT
    async function fetchCard(indexRealEstate) {
        try {
            const carteCottage = await contract.methods.getCard(indexRealEstate, 0).call({ from: accounts[0] });
            const carteVilla = await contract.methods.getCard(indexRealEstate, 1).call({ from: accounts[0] });
            const carteMansion = await contract.methods.getCard(indexRealEstate, 2).call({ from: accounts[0] });
            const carteHighRise = await contract.methods.getCard(indexRealEstate, 3).call({ from: accounts[0] });

            // On considere que le bien n'a pas été tokenisé si la carte n'a pas de tokenID et que sa balance est à 0
            // On ne fait le test que sur la carte cottage (c'est suffisant)
            let minted = false;
            let count = 0;
            if (carteCottage.tokenId > 0 && carteCottage.balance > 0) {
                minted = true;
                count++;
            }
            setMintedRealEstateCount(count);
            console.log('mintedRealEstateCount : ' + mintedRealEstateCount);

            // Pour bien immo, on conserve le resultat. Si le bien n'a pas été tokenisé (minté) le bien ne 
            // doit pas être affiché
            isRealEstateMinted[indexRealEstate] = minted;
            setIsRealEstateMinted(isRealEstateMinted);
            console.log('isRealEstateMinted[0] : ' + isRealEstateMinted[0]);

            const cards = Array();
            cards.push(carteCottage);
            cards.push(carteVilla);
            cards.push(carteMansion);
            cards.push(carteHighRise);

            setInfosCards(cards);

        } catch (error) {
            // alert(error);
        }
    };

    return (
        <>
            <div class="card">
                <div className='d-flex text-lg text-white align-content-end justify-content-end pt-50'><b>Liste des biens immobiliers</b> actuellement disponibles</div>
                <div class="grid">
                    <>
                        {
                            realEstateArray.map((realEstate, index) => {
                                return (
                                    <>
                                        {
                                            index >= 0 && isRealEstateMinted[index] &&
                                            <div key={index} class="col-4 p-3">
                                                <RealEstateView realEstate={realEstate} uri={uri} infosCards={infosCards} buttonAction={action} />
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