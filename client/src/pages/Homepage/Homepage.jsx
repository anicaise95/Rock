import { useEffect } from "react";
import { Button } from 'primereact/button';
import { NavLink } from "react-router-dom";
import styles from "./Homepage.module.scss";
import schema from "../../asset/images/schema.jpg";

//import 'primereact/resources/themes/luna-pink/theme.css';

export default function Homepage() {

    const handleButtonListingsClick = async e => {

    };

    useEffect(() => {
    }, []);

    return (
        <div className="flex-fill container d-flex flex-column p-20">
            <div className={`card flex-fill d-flex flex-column p-20 mb-20 ${styles.contentCard}`}>
                <div className="card" >
                    <div className="backgroundColor:pink height=100">
                        <span>

                        </span>
                    </div>
                    <div>
                        <img src={schema} alt="schema" />
                    </div>
                    <div className="b1" >
                        <NavLink to="listings">
                            <Button label="Voir nos listings" className="p-button-raised p-button-rounded align-content-center" onClick={handleButtonListingsClick} />
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
}