import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';

import './../../asset/styles/primefaces/form.scss';

export default function AdminNFTCardConfiguration() {

    const [countries, setCountries] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getCountries().then(data => setCountries(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function getCountries() {
        return fetch(countries).then(res => res.json())
            .then(d => d.data);
    }

    const validate = (data) => {
        let errors = {};

        if (!data.realEstateName) {
            errors.realEstateName = 'Le nom du programme est nécessaire';
        }
        if (!data.realEstateStreet) {
            errors.realEstateStreet = 'La rue du bien est nécessaire';
        }
        if (!data.realEstateCity) {
            errors.realEstateCity = 'La ville du bien est nécessaire';
        }

        return errors;
    };

    const onClickHandleMessageOK = () => {
        alert('test');
        //setShowMessage(false);
    }

    const onSubmit = (data, form) => {
        setFormData(data);
        setShowMessage(true);
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => navigate('/admin/fees')} /></div>;

    return (
        <>

            <div>
                <ul className="d-flex p-5 pr-20">
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
                        <h5 className="text-center">Nouveau bien immobilier</h5>

                        <Form onSubmit={onSubmit} initialValues={{ realEstateName: '', realEstateStreet: '', realEstateCity: '', realEstateCountry: 'FRANCE' }} validate={validate} render={({ handleSubmit }) => (

                            <form onSubmit={handleSubmit} className="p-fluid">


                                <div class="formgrid grid">
                                    <div class="field col">
                                    </div>
                                    <div class="field col">
                                    </div>
                                </div>

                                <div class="formgroup-inline">
                                    <div class="field">

                                    </div>
                                    <div class="field">

                                    </div>
                                </div>

                                <Field name="realEstateName" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstateName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstateName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Nom du programme *</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />

                                <Field name="realEstateStreet" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstateStreet" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstateStreet" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Numéro / Rue *</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />

                                <Field name="realEstateCity" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="realEstateCity" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="realEstateCity" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Ville *</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />

                                <Field name="realEstateCountry" render={({ input }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Dropdown id="realEstateCountry" {...input} options={countries} optionLabel="name" />
                                            <label htmlFor="realEstateCountry">Pays</label>
                                        </span>
                                    </div>
                                )} />

                                <Button type="submit" label="Enregistrer >>" className="mt-2" />
                            </form>
                        )} />
                    </div>
                </div>
            </div>
        </>
    );
}