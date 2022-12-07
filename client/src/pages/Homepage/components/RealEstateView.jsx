import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './../../../../src/asset/styles/primefaces/card.scss'

export default function RealEstateView(props) {

    const realEstateParam = props.realEstate;
    const action = props.buttonAction;
    const cards = props.cardsArray;
    const indexRealEstate = props.realEstate.id - 1;

    console.log('cards : ' + props.cardsArray);

    console.log('Je rentre dans le composant RealEstateView');
    console.log('realEstate : ' + props.realEstate);
    const subtitle = realEstateParam.city + '-' + realEstateParam.price + ' €'

    const header = (
        <img alt="Card" src={realEstateParam.cid} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} />
    );

    const footer = (
        <span>
            <>
                {
                    <>
                        {
                            action === 'minter' &&
                            <Button label="Minter" icon="pi pi-check" />
                        }
                    </>
                }
                {
                    action === 'voir' &&
                    <Button label="Investir" icon="pi pi-check" />
                }
                {
                    <Button label="Modifier" icon="pi pi-times" className="p-button-secondary ml-2" />
                }
            </>
        </span>
    );

    return (
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
    )
}