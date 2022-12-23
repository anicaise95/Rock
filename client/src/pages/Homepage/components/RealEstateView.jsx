import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import './../../../../src/asset/styles/primefaces/card.scss'
import useEth from "./../../../contexts/EthContext/useEth";
import { Navigate, NavLink } from 'react-router-dom';

export default function RealEstateView(props) {

    const { state: { contract, accounts, web3, owner } } = useEth();

    const realEstateParam = props.realEstate;
    const action = props.buttonAction;

    const infosCards = props.infosCards;
    console.log('infosCards (dans RealEstateView) :' + infosCards);

    const indexRealEstate = props.realEstate.id - 1;

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);

    const subtitle = realEstateParam.city + '-' + realEstateParam.price + ' €'
    const navigateToRealEstateView = 'view/' + indexRealEstate;

    function confirmMint() {
        mint(indexRealEstate);
    };

    // ------------------- CHECK TRANSACTION --------------------

    const [stateAddTransactionSuccess, setStateAddTransactionSuccess] = useState(0);

    function checkTx(hash) {
        let statusElement = document.getElementById("tx-status");
        let hashElement = document.getElementById("tx-hash");

        console.log("Waiting for tx : " + hash);
        statusElement.innerHTML = "Waiting ...";
        hashElement.innerHTML = hash;

        let interval = setInterval(() => {
            web3.eth.getTransactionReceipt(hash, (err, receipt) => {
                setStateAddTransactionSuccess(1);
                if (receipt) {
                    if (receipt.status === true) {
                        console.log(receipt);
                        statusElement.innerHTML = "Success";
                        statusElement.className = 'text-green-600 font-bold';
                        setStateAddTransactionSuccess(2);
                    } else if (receipt.status === false) {
                        console.log("Transaction failed");
                        statusElement.innerHTML = "Failed";
                        statusElement.className = 'text-red-500 font-bold';
                        setStateAddTransactionSuccess(3);
                    }
                    if (err) {
                        console.log(err);
                    }
                    clearInterval(interval)
                }
            })
        }, 1000)
    }

    async function mint(indexRealEstate) {
        try {
            await contract.methods.mintRealEstateCollection(indexRealEstate).send({ from: accounts[0] })
                .on('transactionHash', function (hash) {
                    console.log(hash);
                    checkTx(hash);
                });

        } catch (error) {
            //alert(error);
        }
    };

    const header = (
        <img alt="Card" src={realEstateParam.cid} onError={(e) => e.target.src = 'https://media.tenor.com/Tu0MCmJ4TJUAAAAM/load-loading.gif'} />
    );

    const footer = (
        <span>
            <>
                {
                    <>
                        {
                            action === 'minter' && owner === accounts[0] && 
                            <Button onClick={confirmMint} icon="pi pi-check" label="Minter" />
                        }
                        {
                            action !== 'consulter' && owner === accounts[0] &&
                            <Button label="Modifier" icon="pi pi-times" className="p-button-secondary ml-2" />
                        }
                        {
                            action === 'consulter' &&
                            <NavLink to={navigateToRealEstateView}>
                                <Button onClick="" icon="pi pi-check" label="Investir à partir de 50 €" />
                            </NavLink>
                        }
                        {
                            action === 'consulterMesNfts' &&
                            <NavLink to={navigateToRealEstateView}>
                                <Button onClick="" icon="pi pi-check" label="Consulter" />
                            </NavLink>
                        } 
                    </>
                }
            </>
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
                    {
                        action === 'minter' &&
                        <div id="bloc-tx" className="field">
                            <span>Hash de la transaction : </span><span id='tx-hash'></span>
                            <br />
                            <span>Statut : </span><span id='tx-status' className='text-gray-600 font-bold'></span>
                        </div>
                    }
                </div >
            }
        </>
    )
}