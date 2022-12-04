export default function MarketPlaceOverview() {

    return (
        <>
            <div className="card">
                <h2>Catalogue des NFT disponibles</h2>
            </div>

            <div className="card">
                <div className={`flex flex-wrap card-container blue-container style = "max-width: 500px" `}>
                    <div className={`flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style="min-width: 100px; min-height: 100px`}>1</div>
                    <div className={`flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style="min-width: 100px; min-height: 100px`}>2</div>
                    <div className={`flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style="min-width: 100px; min-height: 100px`}>3</div>
                    <div className={`flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style="min-width: 100px; min-height: 100px`}>4</div>
                    <div className={`flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style="min-width: 100px; min-height: 100px`}>5</div>
                    <div className={`flex align-items-center justify-content-center bg-blue-500 font-bold text-white m-2 border-round" style="min-width: 100px; min-height: 100px`}>6</div>
                </div>
            </div>
        </>

    );
}