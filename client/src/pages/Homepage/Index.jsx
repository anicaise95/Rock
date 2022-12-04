import useEth from "../../contexts/EthContext/useEth";
import Homepage from "./Homepage";
//import ComingSoon from "./../Homepage/components/Artifact/ComingSoon";
import NoticeWrongNetwork from "./../Homepage/components/Artifact/NoticeWrongNetwork";

function HomepageProxyWallet() {
    const { state: { artifact, contract } } = useEth();

    return (
        <>
            {
                //!artifact ? <ComingSoon /> :
                    //!contract ? <NoticeWrongNetwork /> :
                        <Homepage />

            }
        </>
    );
}

export default HomepageProxyWallet;