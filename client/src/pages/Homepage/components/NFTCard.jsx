import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import './../../../../src/asset/styles/primefaces/card.scss'
import { Navigate, NavLink } from 'react-router-dom';
import useEth from "../../../contexts/EthContext/useEth";

export default function NFTCard(props) {

    const { state: { contract, accounts, web3 } } = useEth();

    const realEstateParam = props.realEstate;
    const indexRealEstate = props.realEstate.tokenId - 1;

    // const infosCards = props.infosCards;

    const carteCottage = props.carteCottage;
    const carteVilla = props.carteVilla;
    const carteMansion = props.carteMansion;
    const carteHighRise = props.carteHighRise;

    console.log('carteCottage : ' + carteCottage);
    if (carteCottage !== 'undefined') {
        if (carteCottage.tokenId !== 'undefined') {
            console.log('carteCottage.tokenId : ' + carteCottage.tokenId);
            alert('carteCottage.tokenId : ' + carteCottage.tokenId);
        }
    }


    console.log('carteCottage : ' + carteVilla);
    if (carteVilla !== 'undefined') {
        if (carteVilla.tokenId !== 'undefined') {
            console.log('carteVilla.tokenId : ' + carteVilla.tokenId);
            alert('carteVilla.tokenId : ' + carteVilla.tokenId);
        }
    }

    console.log('carteMansion : ' + carteMansion);
    if (carteMansion !== "undefined") {
        if (carteMansion.tokenId !== "undefined") {
            console.log('carteMansion.tokenId : ' + carteMansion.tokenId);
            alert('carteMansion.tokenId : ' + carteMansion.tokenId);
        }
    }

    console.log('carteHighRise : ' + carteHighRise);
    if (carteHighRise !== "undefined") {
        if (carteHighRise.tokenId !== "undefined") {
            console.log('carteHighRise.tokenId : ' + carteHighRise.tokenId);
            alert('carteHighRise.tokenId : ' + carteHighRise.tokenId);
        }
    }



    //alert(infosCards[0].tokenId);

    // const uri = props.uri;

    /*function getSubtitle() {
        switch (infosCards[0].tokenId) {
            case 1: return "Carte COTTAGE";
            case 2: return "Carte VILLA";
            case 3: return "Carte MANSION";
            case 4: return "Carte HIGH RISE";
                break;
        }
    };*/

    const subtitle = 'TEST';

    //let uriIpfs = uri.replace('{id}', infosCards[0].tokenId);
    //console.log(uriIpfs);

    /*
    const header = (
        <img alt="Card" src={uriIpfs} onError={(e) => e.target.src = 'https://media.tenor.com/Tu0MCmJ4TJUAAAAM/load-loading.gif'} />
    );
    const footer = (
        <span>
            Ici mettre mon texte sur les balances
        </span>
    );
 
    return (
        <>
            {
                <div className='p-20'>
                    <Card title={realEstateParam.name}
                        subTitle={subtitle}
                        style={{ width: '23em' }}
                        footer={footer}
                        header={header}>
                        <p className="m-0" style={{ lineHeight: '1.5' }}>
                            <span>{realEstateParam.location}</span>
                        </p>
                    </Card>
                </div >
            }
        </>
    )*/


}