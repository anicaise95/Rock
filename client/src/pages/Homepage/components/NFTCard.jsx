import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import './../../../../src/asset/styles/primefaces/card.scss'
import { json, Navigate, NavLink } from 'react-router-dom';
import useEth from "../../../contexts/EthContext/useEth";
import './../../../asset/styles/primefaces/nft.scss';

import imgCarteCottage from './../../../asset/images/NFTCards/1.jpg';
import imgCarteVilla from './../../../asset/images/NFTCards/2.jpg';
import imgCarteMansion from './../../../asset/images/NFTCards/3.jpg';
import imgCarteHighRise from './../../../asset/images/NFTCards/4.jpg';


export default function NFTCard(props) {



    const { state: { contract, accounts, web3 } } = useEth();

    const [cottageMetadatas, setCottageMetadatas] = useState({});
    const [villaMetadatas, setVillaMetadatas] = useState({});
    const [mansionMetadatas, setMansionMetadatas] = useState({});
    const [highRiseMetadatas, setHighRiseMetadatas] = useState({});

    const realEstateParam = props.realEstate;
    const indexRealEstate = props.realEstate.tokenId - 1;

    const uri = props.uri;

    const carteCottage = props.carteCottage;
    const carteVilla = props.carteVilla;
    const carteMansion = props.carteMansion;
    const carteHighRise = props.carteHighRise;


    /*
        useEffect(() => {
            getImageInJSONFile(carteCottage.tokenId);
            getImageInJSONFile(carteVilla.tokenId);
            console.log(cottageMetadatas);
        }, [carteCottage]);*/

    /*
    useEffect(() => {
        getImageInJSONFile(carteVilla.tokenId);
    }, [carteVilla]);

    useEffect(() => {
        getImageInJSONFile(carteMansion.tokenId);
    }, [carteMansion]);

    useEffect(() => {
        getImageInJSONFile(carteHighRise.tokenId);
    }, [carteHighRise]);*/

    /*async function getImageInJSONFile(index) {
        const jsonFile = uri.toString().replaceAll('{id}', index);

        const response = await fetch(jsonFile);
        const metadatas = await response.json();
        if (index == 0) {
            console.log(jsonFile)
            setCottageMetadatas(metadatas);
        }
        if (index == 1)
            setVillaMetadatas(metadatas);
        if (index == 2)
            setMansionMetadatas(metadatas);
        if (index == 3)
            setHighRiseMetadatas(metadatas);
    }*/



    //console.log(cottageMetadatas.image);

    return (
        <div class="grid">

            <div class="col-12 headerNFT">
                <div class="grid">


                    <div className='pb-4 col-12'><div className='pb-4 col-12'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte</div></div>

                    <div class="col-6">Autre(s) information(s) sur le bien : </div>
                    <div class="col-6">Parc à proximité, écoles, secteur dynamique</div>

                    <div class="col-6">Nombre de locataires : </div>
                    <div class="col-6" className='pb-2'>1 famille</div>

                    <div class="col-6">Montants des loyers : </div>
                    <div class="col-6">1 345 €</div>

                    <div class="col-6 font-bold text-white pt-2">Rendement estimé à l'année * : </div>
                    <div class="col-6 font-bold text-white pt-2">5 %</div>
                </div>
            </div>

            <div className='pt-4 pb-4 col-12'>Veuillez sélectionner les cartes NFT que vous souhaitez acheter : </div>
            <div class="col-3">Carte cottage</div>
            <div class="col-3">Carte Villa</div>
            <div class="col-3">Carte Mansion</div>
            <div class="col-3">Carte High Rise</div>

            <div class="col-3"><img src={imgCarteCottage} className="imgNFT" /></div>
            <div class="col-3"><img src={imgCarteVilla} className="imgNFT" /></div>
            <div class="col-3"><img src={imgCarteMansion} className="imgNFT" /></div>
            <div class="col-3"><img src={imgCarteHighRise} className="imgNFT" /></div>

            <div class="col-3 font-bold text-white">{carteCottage.price} €</div>
            <div class="col-3 font-bold text-white">{carteVilla.price} €</div>
            <div class="col-3 font-bold text-white">{carteMansion.price} €</div>
            <div class="col-3 font-bold text-white">{carteHighRise.price} €</div>

            <div class="col-3 ">{carteCottage.balance} / {carteCottage.numberOfTokens}</div>
            <div class="col-3 ">{carteVilla.balance} / {carteCottage.numberOfTokens}</div>
            <div class="col-3 ">{carteMansion.balance} / {carteCottage.numberOfTokens}</div>
            <div class="col-3 ">{carteHighRise.balance} / {carteCottage.numberOfTokens}</div>

            <div class="col-12 footerNFT">
                <div class="grid">
                    <div class="col-3"></div>
                    <div class="col-3"></div>
                    <div class="col-3"></div>
                    <div class="col-3"></div>
                </div>
            </div>
        </div>
    )
}