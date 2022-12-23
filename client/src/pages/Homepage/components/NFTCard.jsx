import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import './../../../../src/asset/styles/primefaces/card.scss'
import { json, Navigate, NavLink } from 'react-router-dom';
import useEth from "../../../contexts/EthContext/useEth";
import './../../../asset/styles/primefaces/nft.scss';
import { Slider } from 'primereact/slider';

import imgCarteCottage from './../../../asset/images/NFTCards/1.jpg';
import imgCarteVilla from './../../../asset/images/NFTCards/2.jpg';
import imgCarteMansion from './../../../asset/images/NFTCards/3.jpg';
import imgCarteHighRise from './../../../asset/images/NFTCards/4.jpg';
import logo_eth from './../../../asset/images/ethereum-eth-logo.png';

export default function NFTCard(props) {

    const { state: { contract, accounts, web3, owner, networkID } } = useEth();

    const [cottageMetadatas, setCottageMetadatas] = useState({});
    const [villaMetadatas, setVillaMetadatas] = useState({});
    const [mansionMetadatas, setMansionMetadatas] = useState({});
    const [highRiseMetadatas, setHighRiseMetadatas] = useState({});

    const [qtyCottage, setQtyCottage] = useState(0);
    const [qtyVilla, setQtyVilla] = useState(0);
    const [qtyMansion, setQtyMansion] = useState(0);
    const [qtyHighRise, setQtyHighRise] = useState(0);

    const [totalAmount, setTotalAmount] = useState(0);
    const [plateformFees, setPlateformFees] = useState(2);
    const [totalfees, setTotalfees] = useState(2);
    const [lastPairETHusdPrice, setLastPairETHusdPrice] = useState(0);

    const realEstateParam = props.realEstate;
    const indexRealEstate = props.realEstate.tokenId - 1;
    const uri = props.uri;

    const carteCottage = props.carteCottage;
    const carteVilla = props.carteVilla;
    const carteMansion = props.carteMansion;
    const carteHighRise = props.carteHighRise;

    const network = '1670746639301';
    //setPlateformFees(getPlateformFees());

    useEffect(() => {
        getPlateformFees();
        getLastETHPrice();
    }, [plateformFees]);

    // Calcule le prix total à payer
    const calculeTotalAmount = () => {
        const totalAmount = qtyCottage * carteCottage.price
            + qtyVilla * carteVilla.price
            + qtyMansion * carteMansion.price
            + qtyHighRise * carteHighRise.price;

        setTotalAmount(totalAmount);

        // if (lastPairETHusdPrice == 0)
        // getLastETHPrice();

        if (plateformFees > 0 && totalAmount > 0)
            setTotalfees(totalAmount * (plateformFees / 100));

        document.getElementById('totalAmount').innerHTML = (totalAmount > 0 ? totalAmount + totalfees : 0);
        document.getElementById('totalAmountInEth').innerHTML = swapTotalAmountInEth();
    };

    // Convertir le prix total à payer en ETH
    const swapTotalAmountInEth = () => {
        const ethPrice = lastPairETHusdPrice / (10 ** 8);
        return (totalAmount + totalfees) / ethPrice;
    }

    async function getPlateformFees() {
        try {
            const plateformFees = await contract.methods.plateformFees().call({ from: accounts[0] });
            if (plateformFees == 0) {
                plateformFees = 3;
            }
            setPlateformFees(plateformFees);
        } catch (error) {
            //alert(error);
        }
    };

    // Récupérer le dernier cours de l'ETH
    async function getLastETHPrice() {
        try {
            console.log('LastPairETHusdPrice avant');
            const ethPriceInWei = await contract.methods.getLatestPrice().call({ from: accounts[0] });
            console.log('LastPairETHusdPrice : ' + ethPriceInWei);
            setLastPairETHusdPrice(ethPriceInWei);
        } catch (error) {
            console.log("Impossible de récupérer le dernier prix de l'ETH");
            setLastPairETHusdPrice(127428811611);
        }
    };

    console.log('networkID : ' + networkID);

    const sendTransaction = async () => {

        const tokensId = new Array();
        const quantitites = new Array();

        if (qtyCottage > 0) {
            tokensId.push(carteCottage.tokenId);
            quantitites.push(qtyCottage);
        }

        if (qtyVilla > 0) {
            tokensId.push(carteVilla.tokenId);
            quantitites.push(qtyVilla);
        }

        if (qtyMansion > 0) {
            tokensId.push(carteMansion.tokenId);
            quantitites.push(qtyMansion);
        }

        if (qtyHighRise > 0) {
            tokensId.push(carteHighRise.tokenId);
            quantitites.push(qtyHighRise);
        }

        const index = 0;

        try {
            const accountFrom = web3.utils.toChecksumAddress(accounts[0]);

            console.log(`Attempting to send transaction from ${accountFrom} to ${owner}`);

            console.log('accounts[0] : ', accounts[0]);
            console.log('owner : ', owner);

            console.log('tokensId : ' + tokensId);
            console.log('quantitites : ' + quantitites);
            console.log('index : ' + index);

            const amountToPay = swapTotalAmountInEth();
            const amount = amountToPay.toString();

            if (amountToPay !== 'undefined' || amountToPay > 0) {
                await contract.methods.confirmBuy(tokensId, quantitites, index).send({
                    from: accounts[0],
                    to: owner,
                    value: web3.utils.toWei(amount, 'ether'),
                    gas: web3.utils.toHex(300000),
                }).on('transactionHash', function (hash) {
                    console.log('hash transaction : ' + hash);
                }).on('receipt', function (receipt) {
                    console.log('receipt transaction : ' + receipt);
                })
                    .on('confirmation', function (confirmationNumber, receipt) {
                        console.log('confirmation transaction A : ' + confirmationNumber);
                        console.log('confirmation transaction B : ' + receipt);
                    })
                    .on('error', console.error);
            } else {
                alert('Aucune carte achetée !');
            }
        } catch (error) {
            //alert('error ' + error);
        }
    };

    return (
        <div class="grid">

            <div class="col-12 headerNFT">
                <div class="grid">

                    <div className='pb-4 col-12'><div className='pb-2 col-12'>Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte</div></div>

                    <div class="col-6">Autre(s) information(s) sur le bien : </div>
                    <div class="col-6">Parc à proximité, écoles, secteur dynamique</div>

                    <div class="col-6">Nombre de locataires : </div>
                    <div class="col-6" className='pb-2'>1 famille</div>

                    <div class="col-6">Montants des loyers : </div>
                    <div class="col-6">1 345 €</div>

                    <div class="col-6 text-green-500">Frais de gestion : </div>
                    <div class="col-6 text-green-500 font-bold ">{plateformFees} % *</div>
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
            <div class="col-3 ">{carteVilla.balance} / {carteVilla.numberOfTokens}</div>
            <div class="col-3 ">{carteMansion.balance} / {carteMansion.numberOfTokens}</div>
            <div class="col-3 ">{carteHighRise.balance} / {carteHighRise.numberOfTokens}</div>

            <div class="col-3 pt-3"><Slider value={qtyCottage} min="0" max="10" onChange={(e) => { setQtyCottage(e.value); calculeTotalAmount() }} /></div>
            <div class="col-3 pt-3"><Slider value={qtyVilla} min="0" max="10" onChange={(e) => { setQtyVilla(e.value); calculeTotalAmount() }} /></div>
            <div class="col-3 pt-3"><Slider value={qtyMansion} min="0" max="10" onChange={(e) => { setQtyMansion(e.value); calculeTotalAmount() }} /></div>
            <div class="col-3 pt-3"><Slider value={qtyHighRise} min="0" max="2" onChange={(e) => { setQtyHighRise(e.value); calculeTotalAmount() }} /></div>

            <div class="col-12 footerNFT">
                <div class="grid">
                    <div class="col-6 pt-6">
                        <div>
                            <span>Montant total à payer : </span><span className='font-bold text-white' id='totalAmount' /><span className='font-bold text-white'> €</span>
                            <span class="col-6 text-green-500 font-bold "> *</span>
                        </div>
                        <div>
                            <img src={logo_eth} className='logo_eth' />
                            <span id='totalAmountInEth' className='pt-3' />
                            <span> ETH </span>
                        </div>

                    </div>
                    <div id="btnConfirmPay" class="col-6 pt-8 justify-content-end text-right">
                        <NavLink end to='/profile/' >
                            <Button hidden={!networkID === network} label="Valider mon achat" icon="pi pi-check" iconPos="right" onClick={sendTransaction} />
                            <span hidden={!networkID !== network} id="labelNotConnected" className='font-bold text-white'>Veuillez vous connecter au réseau Ethereum !</span>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}