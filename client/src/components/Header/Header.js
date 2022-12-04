import styles from "./Header.module.scss";
import logo from "../../asset/images/logo_petit.jpg";
import logo_title from "../../asset/images/logo_title_petit.jpg";

import useEth from "../../contexts/EthContext/useEth";
import { NavLink } from 'react-router-dom';

function Header() {

    const { state: { contract, accounts, networkID } } = useEth();

    console.log('networkID : ' + networkID);
    console.log('accounts : ' + accounts);
    console.log('contract : ' + contract);

    if (networkID == null && accounts == null) {
        console.log("Vous n'êtes pas connecté à Metamask");
        console.log(networkID);
        console.log(accounts);
    } else {
        if (networkID != '80001') {
            document.getElementById('errorWallet').innerHTML = "Attention, vous devez vous connecter sur le réseau Polygon !";
        } else {
            document.getElementById('errorWallet').innerHTML = "Réseau POLYGON connecté";
        }
        if (accounts != null) {
            document.getElementById('wallet').innerHTML = accounts[0];
        }
    }

    return (
        <header className={`${styles.header}`}>

            <div class="card">
                <div class="card-container white-container overflow-hidden">
                    <div class="flex">
                        <div class="flex-1 flex align-items-end justify-content-end pr-10 font-bold text-gray-900 border-round">
                            <NavLink to="/">
                                <img id="logo" src={logo} alt="Logo" />
                            </NavLink>
                        </div>
                        <div class="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 border-round">
                            <NavLink to="/">
                                <img id="logotitle" src={logo_title} alt="Logo" />
                            </NavLink>
                        </div>
                        <div class="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 border-round">
                            <ul>
                                <li className="text-blue-500 mb-3" id="wallet"></li>
                                <li className="font-bold text-pink-600" id="errorWallet"></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </header >
    );
}

export default Header; 