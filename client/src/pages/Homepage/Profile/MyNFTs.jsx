import useEth from "../../../contexts/EthContext/useEth";
import React, { useEffect, useState, useParams } from 'react';
import imgCarteCottage from './../../../asset/images/NFTCards/1.jpg';
import imgCarteVilla from './../../../asset/images/NFTCards/2.jpg';
import imgCarteMansion from './../../../asset/images/NFTCards/3.jpg';
import imgCarteHighRise from './../../../asset/images/NFTCards/4.jpg';
import logo_eth from './../../../asset/images/ethereum-eth-logo.png';
import RealEstateView from '../../Homepage/components/RealEstateView';

export default function MyNfts() {

    const { state: { contract, accounts, web3, owner } } = useEth();
    const [myNfts, setMyNfts] = useState([]);
    const [uri, setURI] = useState([]);
    const [realEstateCount, setRealEstateCount] = useState(0);
    const [realEstateArray, setRealEstateArray] = useState([]);
    const [infosCards, setInfosCards] = useState({});

    const action = "consulterMesNfts";

    // On recupére le nombre de biens immobiliers gérés par ROCK
    async function fetchRealEstatesCollection() {
        try {
            setRealEstateCount(await contract.methods.getRealEstatesCollectionCount().call({ from: accounts[0] }));
            console.log("MyProfile - Nombre de biens immobiliers : " + realEstateCount);

            const realEstateArray = Array();
            for (let indexRealEstate = 0; indexRealEstate < realEstateCount; indexRealEstate++) {
                realEstateArray.push(await contract.methods.realEstatesCollection(indexRealEstate).call({ from: accounts[0] }));
                // Liste des biens mintés (pour les afficher)
                fetchMyNfts(indexRealEstate);
            }
            console.log("Liste des biens immobiliers : " + realEstateArray);
            setRealEstateArray(realEstateArray);
        }
        catch (error) {
        // alert(error);
        }
    };

    // On recupére les éventuels NFTS détenus par le wallet connecté pour chaque bien immobilier
    async function fetchMyNfts(indexRealEstate) {
        try {
            const myNftsCards = [];
            // Les 4 cartes du bien correspondant à indexRealEstate sont stockées dans une case du tableau myNftsCards
            myNftsCards.push(await contract.methods.fetchMyNfts(indexRealEstate).call({ from: accounts[0] })); 
            setMyNfts(myNftsCards);

            console.log("MyProfile - mes NFTS : " + myNfts);

            /*
            for(let i = 0; i < 4; i++){
                console.log(i);
                console.log("Carte " + i + " : " + myNfts[indexRealEstate][i]);
                console.log("tokenId : " + myNfts[indexRealEstate][i].tokenId);
                console.log("price : " + myNfts[indexRealEstate][i].price);
                console.log("quantity : " + myNfts[indexRealEstate][i].quantity);
                console.log("acheté à  : " + myNfts[indexRealEstate][i].seller);
            } */
        }
        catch (error) {
            console.error("MyProfile - mes NFTS : " + error);
        }
    };

    useEffect(() => {
        console.log("MyProfile - Entrée dans le useEffect");
        fetchRealEstatesCollection();
    }, [realEstateCount]);

    return (
        <div class="grid">
            <div class="col-6">Liste des biens</div>
            <div class="col-6">Liste des NFTS</div> 

            
                    <>
                        {
                            realEstateArray.map((realEstate, indexRealEstate) => {
                                return (
                                    <>
                                    <div class="col-6">
                                        <div class="grid">
                                            <>
                                                {
                                                    indexRealEstate >= 0 &&
                                                    <div key={indexRealEstate} class="grid">
                                                        <RealEstateView realEstate={realEstate} uri={uri} infosCards={infosCards} buttonAction={action} />
                                                    </div>
                                                }
                                            </>
                                        </div>
                                    </div>
                                    
                                    <div class="col-6">  
                                        <>
                                            {
                                                myNfts[indexRealEstate].map((NFTcard, cardId) => {
                                                    return (
                                                        <>
                                                            {
                                                                cardId >= 0 && 
                                                                <div key={cardId} class="col-4 p-3">
                                                                    {
                                                                        cardId === 0 && 
                                                                        <div class="col-3"><img src={imgCarteCottage} className="imgNFT" /></div>
                                                                    }
                                                                    {
                                                                        cardId === 1 && 
                                                                        <div class="col-3"><img src={imgCarteVilla} className="imgNFT" /></div>
                                                                    }
                                                                    {
                                                                        cardId === 2 && 
                                                                        <div class="col-3"><img src={imgCarteMansion} className="imgNFT" /></div>
                                                                    }
                                                                    {
                                                                        cardId === 3 && 
                                                                        <div class="col-3"><img src={imgCarteHighRise} className="imgNFT" /></div>
                                                                    }
                                                                    <div class="col-3">{NFTcard.tokenId} </div>
                                                                    <div class="col-3">{NFTcard.price} </div>
                                                                    <div class="col-3">{NFTcard.quantity} </div>
                                                                </div>
                                                            }
                                                        </>
                                                    )
                                                })
                                            }
                                        </>
                                    </div>
                                    </>
                                )
                            })
                        }
                    </>
            </div>
    );
}