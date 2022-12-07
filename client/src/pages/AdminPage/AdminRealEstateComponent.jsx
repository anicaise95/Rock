import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import RealEstateView from '../Homepage/components/RealEstateView';

export default function AdminRealEstateComponent(props) {

    const realEstate = props;
    console.log('Je rentre dans le composant AdminRealEstateComponent');
    console.log('realEstate : ' + props);

    <div class="card">

        <div class="formgrid grid">
            <div class="field col">
                <RealEstateView realEstate={props} />
            </div>
            <div class="field col">
                Ma configurtion
            </div>
        </div>
    </div>

}