import React, { useEffect, useState, useParams } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useEth from "../../contexts/EthContext/useEth";
import { Outlet } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import RealEstateView from '../Homepage/components/RealEstateView';
import './../../asset/styles/primefaces/form.scss';

export default function AdminNFTCardConfiguration() {

    const { state: { contract, accounts, web3 } } = useEth();

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [value1ETHUSD, setValue1ETHUSD] = useState({});
    const [realEstate, setRealEstate] = useState({});
    const [lastIndex, setLastIndex] = useState(0);
    const [stateAddTransactionSuccess, setStateAddTransactionSuccess] = useState(0);

    const navigate = useNavigate();

    async function fetchRealEstatesCollection() {
        try {
            // On recupére le dernier élement, celui que nous allons modifier
            const count = await contract.methods.getRealEstatesCollectionCount().call({ from: accounts[0] });
            const indexRealEstate = count - 1;

            const lastRealEstate = await contract.methods.getRealStateById(indexRealEstate).call({ from: accounts[0] });
            setRealEstate(lastRealEstate);
            setLastIndex(indexRealEstate);

            //console.log(lastRealEstate);
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        if (contract != null) {
            fetchRealEstatesCollection();
        }
    }, [contract, lastIndex]);

    async function calculateNumberOfTokens(id, ratioCottage, ratioVilla, ratioMansion, cottageCardPrice, villaCardPrice, mansionCardPrice, highRiseCardPrice) {
        try {
            // Ici le call avant le send permet de recupérer les require
            //await contract.methods.calculateNumberOfTokens(id, false, ratioCottage, ratioVilla, ratioMansion, cottageCardPrice, villaCardPrice, mansionCardPrice, highRiseCardPrice).call({ from: accounts[0] });
            //alert('calculateNumberOfTokens 1');
            await contract.methods.calculateNumberOfTokens(id, false, ratioCottage, ratioVilla, ratioMansion, cottageCardPrice, villaCardPrice, mansionCardPrice, highRiseCardPrice).call({ from: accounts[0] })
            await contract.methods.calculateNumberOfTokens(id, false, ratioCottage, ratioVilla, ratioMansion, cottageCardPrice, villaCardPrice, mansionCardPrice, highRiseCardPrice).send({ from: accounts[0] })
                .on('transactionHash', function (hash) {
                    console.log(hash);
                    checkTx(hash);
                })

            contract.events.supplyCardsCalculated(() => { })
                .on('data', function (event) {
                });

        } catch (error) {
            alert(error);
        }
    }

    const validate = (data) => {
        let errors = {};

        if (!data.ratioCottage) {
            errors.ratioCottage = 'Le ratio Cottage est nécessaire';
        }
        if (!data.ratioVilla) {
            errors.ratioVilla = 'Le ratio Villa est nécessaire';
        }
        if (!data.ratioMansion) {
            errors.ratioMansion = 'Le ratio Mansion est nécessaire';
        }

        if (!data.cottageCardPrice) {
            errors.cottageCardPrice = 'Le prix Cottage est nécessaire';
        }
        if (!data.villaCardPrice) {
            errors.villaCardPrice = 'Le prix Villa est nécessaire';
        }
        if (!data.mansionCardPrice) {
            errors.mansionCardPrice = 'Le prix Mansion est nécessaire';
        }
        if (!data.highRiseCardPrice) {
            errors.highRiseCardPrice = 'Le prix High Rise est nécessaire';
        }
        return errors;
    };

    const onClickHandleMessageOK = () => {
    }

    useEffect(() => {
        document.getElementById('buttonAddSubmit').hidden = true;
        document.getElementById('buttonNextStep').hidden = true;
        if (stateAddTransactionSuccess == 0) {
            document.getElementById('buttonAddSubmit').hidden = false;
            document.getElementById('buttonNextStep').hidden = true;
        }
        if (stateAddTransactionSuccess == 2) {
            document.getElementById('buttonAddSubmit').hidden = true;
            document.getElementById('buttonNextStep').hidden = false;
        }
    }, [stateAddTransactionSuccess]);

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

    const onSubmit = (data, form) => {
        setFormData(data);
        console.log('data : ' + data);
        calculateNumberOfTokens(lastIndex, data.ratioCottage, data.ratioVilla, data.ratioMansion, data.cottageCardPrice, data.villaCardPrice, data.mansionCardPrice, data.highRiseCardPrice)
        //setShowMessage(true);
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => navigate('/admin/fees')} /></div>;

    return (
        <>
            <div>
                <ul className="d-flex">
                    <li className="mr-3"><NavLink end to="" >Tableau de bord</NavLink></li>
                    <li className="mr-3"><NavLink to="addrealestate"><b className='text-yellow-600 no-underline'>Ajouter un bien immobilier</b></NavLink></li>
                    <li className=""><NavLink to="/admin/fees">Gestion des frais</NavLink></li>
                </ul>
            </div>

            <div><Outlet /></div>

            <div class="card">

                <div class="formgrid grid">
                    <div class="field col">
                        <RealEstateView realEstate={realEstate} />
                    </div>
                    <div class="field col">
                        <div className="form-demo">

                            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                <div className="flex align-items-center flex-column pt-6 px-3">
                                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                                    <h5>Le bien <b>{formData.realEstateName}</b> a été enregistré dans la blockchain</h5>
                                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                        <b>Veuillez maintenant renseigner les informations sur les CARTES NFT</b>
                                    </p>
                                </div>
                            </Dialog>

                            <div className="flex justify-content-center">
                                <div className="card">
                                    <h5 className="text-center">Répartition et prix des cartes NFT</h5>
                                    <Form onSubmit={onSubmit} initialValues={{ ratioCottage: '', ratioVilla: '', ratioMansion: '', ratioHighRise: '', cottageCardPrice: '', villaCardPrice: '', mansionCardPrice: '', highRiseCardPrice: '' }} validate={validate} render={({ handleSubmit }) => (

                                        <form onSubmit={handleSubmit} className="p-fluid">

                                            <div className="card">
                                                <div className="field col-12 ">
                                                    <span className="text-xl font-semibold">Proportion de NFT à miner</span>
                                                </div>

                                                <div className="grid p-fluid">

                                                    <Field name="ratioCottage" render={({ input, meta }) => (
                                                        <div className="field p-10" >
                                                            <span className="p-float-label">
                                                                <InputText id="ratioCottage" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="ratioCottage" className={classNames({ 'p-error': isFormFieldValid(meta) })}>% cartes COTTAGE * : </label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )} />

                                                    <Field name="ratioVilla" render={({ input, meta }) => (
                                                        <div className="field p-10">
                                                            <span className="p-float-label">
                                                                <InputText id="ratioVilla" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="ratioVilla" className={classNames({ 'p-error': isFormFieldValid(meta) })}>% cartes VILLA * : </label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )} />

                                                    <Field name="ratioMansion" render={({ input, meta }) => (
                                                        <div className="field p-10">
                                                            <span className="p-float-label">
                                                                <InputText id="ratioMansion" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="ratioMansion" className={classNames({ 'p-error': isFormFieldValid(meta) })}>% cartes Mansion * </label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )} />

                                                    <div className="field col-12 ">
                                                        <span className="text-xl font-semibold">Prix de vente de chaque carte NFT en €</span>
                                                    </div>

                                                    <Field name="cottageCardPrice" render={({ input, meta }) => (
                                                        <div className="field p-10">
                                                            <span className="p-float-label">
                                                                <InputText id="cottageCardPrice" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="cottageCardPrice" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Prix carte COTTAGE (en € ) * : </label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )} />

                                                    <Field name="villaCardPrice" render={({ input, meta }) => (
                                                        <div className="field p-10">
                                                            <span className="p-float-label">
                                                                <InputText id="villaCardPrice" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="villaCardPrice" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Prix carte Villa (en € ) * : </label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )} />

                                                    <Field name="mansionCardPrice" render={({ input, meta }) => (
                                                        <div className="field p-10">
                                                            <span className="p-float-label">
                                                                <InputText id="mansionCardPrice" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="mansionCardPrice" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Prix carte Mansion (en € ) * : </label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )} />

                                                    <Field name="highRiseCardPrice" render={({ input, meta }) => (
                                                        <div className="field p-10">
                                                            <span className="p-float-label">
                                                                <InputText id="highRiseCardPrice" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                                <label htmlFor="highRiseCardPrice" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Prix carte High Rise (en € ) * : </label>
                                                            </span>
                                                            {getFormErrorMessage(meta)}
                                                        </div>
                                                    )} />

                                                    <Field name="field-tx" render={({ input, meta }) => (
                                                        <div id="bloc-tx" className="field">
                                                            <span>Hash de la transaction : </span><span id='tx-hash'></span>
                                                            <br />
                                                            <span>Statut : </span><span id='tx-status' className='text-gray-600 font-bold'></span>
                                                        </div>
                                                    )} />

                                                </div>
                                            </div>

                                            <div id='buttonAddSubmit'>
                                                <Button type="submit" label="Enregistrer >>" className="mt-2" />
                                            </div>

                                            <div id='buttonNextStep'>
                                                <NavLink end to='/admin' >
                                                    <Button label="Retour au tableau de bord >>" className="mt-2" />
                                                </NavLink>
                                            </div>
                                        </form>
                                    )} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}