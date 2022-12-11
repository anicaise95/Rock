import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import RealEstateView from '../Homepage/components/RealEstateView';

export default function AdminRealEstateComponent(props) {

    const realEstate = props;
    <div class="card">

        <div class="formgrid grid">
            <div class="field col">
                <RealEstateView realEstate={props} />
            </div>
        </div>

    </div>

}