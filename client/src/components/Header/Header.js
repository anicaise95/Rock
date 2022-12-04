import styles from "./Header.module.scss";
import logo from "../../asset/images/logo.jpg";
import useEth from "../../contexts/EthContext/useEth";
import { NavLink } from 'react-router-dom';

function Header(props) {
    return (
        <header className={`${styles.header} d-flex flex-row align-items-center`}>

            <div className="flex-fill">
                <NavLink to="/">
                    <img src={logo} alt="Logo" />
                </NavLink>
            </div>
            <>
                contract && artifact
                <span>Vous êtes connecté avec l'adresse</span>
            </>
            <>
                !contract &&
                <span>Vous n'êtes pas connecté</span>
            </>

        </header >
    );
}

export default Header; 