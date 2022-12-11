import { NavLink, useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import useEth from '../../../contexts/EthContext/useEth';
import RealEstateView from "../components/RealEstateView";
import NFTCard from "../components/NFTCard";


export default function ListingsOne() {

    const { id } = useParams();

    const { state: { contract, accounts, owner } } = useEth();
    const [realEstate, setRealEstate] = useState({});
    const [indexRealEstate, setIndexRealEstate] = useState(id);
    const [infosCards, setInfosCards] = useState([]);
    const [carteCottage, setCarteCottage] = useState({});
    const [carteVilla, setCarteVilla] = useState({});
    const [carteMansion, setCarteMansion] = useState({});
    const [carteHighRise, setCarteHighRise] = useState({});

    const [uri, setURI] = useState([]);

    useEffect(() => {
        getUri();
    }, [contract]);


    useEffect(() => {
        findRealEstateInCollection();
    }, [contract]);

    useEffect(() => {
        fetchCard();
    }, []);

    async function findRealEstateInCollection() {
        try {
            const realEstate = await contract.methods.getRealStateById(indexRealEstate).call({ from: accounts[0] });
            setRealEstate(realEstate);
            setIndexRealEstate(indexRealEstate);
        } catch (error) {
            //alert(error);
        }
    };

    // Récupération des informations sur les cartes NFT
    async function fetchCard() {
        try {
            const carteCottage = await contract.methods.getCard(indexRealEstate, 0).call({ from: accounts[0] });
            const carteVilla = await contract.methods.getCard(indexRealEstate, 1).call({ from: accounts[0] });
            const carteMansion = await contract.methods.getCard(indexRealEstate, 2).call({ from: accounts[0] });
            const carteHighRise = await contract.methods.getCard(indexRealEstate, 3).call({ from: accounts[0] });

            setCarteCottage(carteCottage);
            setCarteVilla(carteVilla);
            setCarteMansion(carteMansion);
            setCarteHighRise(carteHighRise);

        } catch (error) {
            //alert(error);
        }
    };

    async function getUri() {
        try {
            const uri = await contract.methods.uri(indexRealEstate).call({ from: accounts[0] });
            setURI(uri);
        } catch (error) {
            //alert(error);
        }
    };

    return (
        <>
            <div class="card">
                <div class="formgrid grid">
                    <div class="field col">
                        <RealEstateView realEstate={realEstate} uri={uri} infosCards={infosCards} />
                    </div>
                    <div class="field col mt-2">
                        <NFTCard realEstate={realEstate} uri={uri} infosCards={infosCards} carteCottage={carteCottage} carteVilla={carteVilla} carteMansion={carteMansion} carteHighRise={carteHighRise} />
                    </div>
                </div>
            </div>
        </>
    );
}