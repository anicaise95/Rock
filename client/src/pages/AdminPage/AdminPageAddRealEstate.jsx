import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useEth from "../../contexts/EthContext/useEth";
import { Outlet } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import './../../asset/styles/primefaces/form.scss';

export default function AdminPageAddRealEstate(props) {

    const { state: { contract, accounts, web3 } } = useEth();

    const [countries, setCountries] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [stateAddTransactionSuccess, setStateAddTransactionSuccess] = useState(0);
    const [redirectNextStep, setRedirectNextStep] = useState('');

    const navigate = useNavigate();
    const realEstateId = 0;

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

    async function addRealEstate(name, street, city, cid, price/*, cid, saleStartDate, saleEndDate*/) {
        try {
            // Ici le call avant le send permet de recupérer les require
            await contract.methods.addRealEstate(name, street, city, cid, price/*, cid, saleStartDate, saleEndDate*/).call({ from: accounts[0] });
            await contract.methods.addRealEstate(name, street, city, cid, price/*, cid, saleStartDate, saleEndDate*/).send({ from: accounts[0] })
                .on('transactionHash', function (hash) {
                    console.log(hash);
                    checkTx(hash);
                });

            contract.events.RealEstateAdded(() => { })
                .on('data', function (event) {
                    console.log('Event : ' + '/admin/nftcardconfig/' + event.returnValues[0])
                    setRedirectNextStep('/admin/nftcardconfig/' + event.returnValues[0]);
                    console.log("realEstateId : " + event.returnValues[0]);
                }).on('error', function (error, receipt) {
                    console.log('Error:', error, receipt);
                });
        } catch (error) {
            alert(error);
        }
    }
    // Récupération de l'évenement

    function getCountries() {
        return fetch(countries).then(res => res.json())
            .then(d => d.data);
    }

    const validate = (data) => {
        let errors = {};

        if (!data.realEstateName) {
            errors.realEstateName = 'Le titre de la fiche est nécessaire';
        }
        if (!data.realEstateStreet) {
            errors.realEstateStreet = 'La description est nécessaire';
        }
        if (!data.realEstateCity) {
            errors.realEstateCity = 'Autres informations nécessaires';
        }
        if (!data.realEstateCid) {
            errors.realEstateCid = 'Le path vers les images du bien est nécessaire';
        }
        if (!data.realEstatePrice || data.realEstatePrice < 50000) {
            errors.realEstatePrice = 'Le prix ne peut pas être inférieur à 50 000 €';
        }

        return errors;
    };

    const handleSubmitForm = async (data, form) => {
        setFormData(data);
        addRealEstate(data.realEstateName, data.realEstateStreet, data.realEstateCity, data.realEstateCid, data.realEstatePrice);
        //setShowMessage(true);
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => navigate('/admin/nftcardconfig')} /></div>;

    return (
        <>

            <div>
                <ul className="d-flex">
                    <li className="mr-3"><NavLink end to="" >Tableau de bord</NavLink></li>
                    <li className="mr-3"><NavLink to="addrealestate"><b className='text-yellow-600 no-underline'>Ajouter un bien immobilier</b></NavLink></li>
                    <li className=""><NavLink to="/admin/fees">Gestion des frais</NavLink></li>
                </ul>
            </div>

            <div className='p-20'>
                <Outlet />
            </div>


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
                        <h5 className="text-center text-lg font-bold text-left">Ajout d'un nouveau bien immobilier</h5>

                        <Form onSubmit={handleSubmitForm} initialValues={{ realEstateName: '', realEstateStreet: '', realEstateCity: '', realEstateCid: '', realEstatePrice: '' }} validate={validate} render={({ handleSubmit }) => (

                            <form onSubmit={handleSubmit} className="p-fluid">

                                <Field name="realEstateName" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstateName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstateName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Titre de la fiche : *</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />

                                <Field name="realEstateStreet" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstateStreet" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstateStreet" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Description du bien : *</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />

                                <Field name="realEstateCity" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstateCity" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstateCity" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Informations sur le bien : *</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />

                                <Field name="realEstateCid" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstateCid" {...input} autoFocus keyfilter={/^[^#<>*!]+$/} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstateCid" className={classNames({ 'p-error': isFormFieldValid(meta) })}>CID des images *</label>
                                        </span>
                                        <div>{getFormErrorMessage(meta)}</div>
                                    </div>
                                )} />

                                <Field name="realEstatePrice" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstatePrice" {...input} keyfilter="int" autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstatePrice" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Prix du bien (€) *</label>
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

                                <div id='buttonAddSubmit'>
                                    <Button type="submit" label="Enregistrer >>" className="mt-2" />
                                </div>

                                <div id='buttonNextStep'>
                                    <NavLink end to='/admin/nftcardconfig/' >
                                        <Button label="Passer à la configuration des NFT >>" className="mt-2" />
                                    </NavLink>
                                </div>
                            </form>

                        )} />
                    </div>
                </div>
            </div>
        </>
    );
}