import { NavLink, useParams } from "react-router-dom";
import useEth from '../../../contexts/EthContext/useEth';

export default function ListingsOne() {

    const { id } = useParams();
    console.log('Identifiant du bien immobilier : ' + id);

    const { state: { networkID, accounts } } = useEth();

    if (networkID == null && accounts == null) {
        console.log("Vous n'êtes pas connecté à Metamask");
    } else {
        if (networkID != '80001' && accounts != null) {
            document.getElementById('errorWallet').innerHTML = "Vous devez être connecté au réseau Polygon pour pouvoir pour accéder aux NFT";
        } else {
            document.getElementById('errorWallet').innerHTML = "";
        }
    }

    return (
        <>
            <div className="card flex-fill d-flex justify-content-end">
                <h2 className="text-base pr-2">Détail du bien</h2>
            </div>
            <div className="flex-fill container d-flex flex-column">
                <div className={`card flex-fill d-flex flex-column mb-20 contentCard`}>
                    <div className="card" >
                        <div className="flex align-items-center bg-white justify-content-center h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">

                        </div>
                        <div className="flex align-items-center bg-white justify-content-center h-15rem bg-white-500 font-bold text-black border-pink-100 hover:border-700 border-3 border-round m-2">
                            <div class="card">
                                <div class="flex flex-wrap justify-content-center card-container blue-container gap-3">
                                    <div class="border-round w-12rem h-6rem bg-blue-500 text-white font-bold flex align-items-center justify-content-center">1</div>
                                    <div class="border-round w-12rem h-6rem bg-blue-500 text-white font-bold flex align-items-center justify-content-center">2</div>
                                    <div class="border-round w-12rem h-6rem bg-blue-500 text-white font-bold flex align-items-center justify-content-center">3</div>
                                    <div class="border-round w-12rem h-6rem bg-blue-500 text-white font-bold flex align-items-center justify-content-center">4</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex align-items-center bg-white justify-content-center h-2rem bg-white-500 text-black m-1">
                            <ul>
                                <li id="errorWallet"></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}