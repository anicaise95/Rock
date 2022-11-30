  // SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IERC2981Royalties {
    function royaltyInfo(uint256 _tokenId, uint256 _value) external view  returns (address _receiver, uint256 _royaltyAmount);
}

/*
contract Royalties is IERC2981Royalties, ERC165 {

    struct RoyaltyInfo {
        address recipient;
        uint24 amount;
    }

    mapping(uint256 => RoyaltyInfo) internal _royalties;

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC2981Royalties).interfaceId || super.supportsInterface(interfaceId);
    }

    function _setTokenRoyalty( uint256 tokenId, address recipient, uint256 value) internal {
        require(value <= 10000, "ERC2981Royalties: Too high");
        _royalties[tokenId] = RoyaltyInfo(recipient, uint24(value));
    }

    function royaltyInfo(uint256 tokenId, uint256 value) external view override returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties[tokenId];
        receiver = royalties.recipient;
        royaltyAmount = (value * royalties.amount) / 10000;
    }
}*/

contract Rock is ERC1155/*, Royalties*/, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _realEstateIds;
    uint256 internal fees = 5000; // 5%

    // Nom de la collection ROCK (qui apparaitra sur Opensea
    string public name = "Rock Collection";
    string public symbol = "Rock";

    // Programme immo
    struct RealEstate {
        uint    id;
        string name;        // Nom du programme immo
        string location;    // Localisation 
        string city;        // Ville
        uint256 price;      // Prix du bien
    }
    
    // Notre parc de biens immobilier
    RealEstate[] internal realEstatesCollection;

    // Index du bien => tableau de cartes
    mapping(uint256 => Card) internal cards;

    struct Card {
        uint256 cardId;
        uint256 price;
        uint256 numberOfTokens;
        uint256 ratioOfTokensInPercent;
    }

    // Type de carte
    uint256 internal constant CARD_COTTAGE   = 0;
    uint256 internal constant CARD_VILLA     = 1;
    uint256 internal constant CARD_MANSION   = 2;
    uint256 internal constant CARD_HIGH_RISE = 3;

    // Répartion des tokens par type de carte
    uint256 private constant DEFAULT_RATIO_COTTAGE_TOKENS   = 50;
    uint256 private constant DEFAULT_RATIO_VILLA_TOKENS     = 30;
    uint256 private constant DEFAULT_RATIO_MANSION_TOKENS   = 20;
    AggregatorV3Interface internal priceFeed;

    event supplyCardsCalculated (
        uint256 idToken,
        uint256 supplyCottage,
        uint256 supplyVilla,
        uint256 supplyMansion,
        uint256 supplyHighRise
    );

    event tokenMinted (uint256 idRealEstate);
    event RealEstateAdded (uint256 idRealEstate);

    constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmYF4vRAZg19ARiSFoXevZYkf9Zp1yVdgXhh4x22bypMc4/{id}.json") {
        /**
        * Network: MUMBAI
        * Aggregator: MATIC / USD
        * https://docs.chain.link/data-feeds/price-feeds/addresses/?network=polygon#Mumbai%20Testnet
        * Address: 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
        */

        /**
        * Network: Polygon Mainnet
        * Aggregator: MATIC / USD
        * https://docs.chain.link/data-feeds/price-feeds/addresses/?network=polygon
        * Address: 0xAB594600376Ec9fD91F8e885dADF0CE036862dE0
        */
        priceFeed = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada);
    }



    /*function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }*/
    
    // L'administrateur déclare un nouveau bien immo
    // Retourne la position du bien immo dans le tableau
    function addRealEstate(string memory _name, string memory _location, string memory _city, uint _price) public onlyOwner {

        require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Le nom du programme immobilier est obligatoire");
        require(keccak256(abi.encode(_location)) != keccak256(abi.encode("")), "La situation est obligatoire");
        require(keccak256(abi.encode(_city)) != keccak256(abi.encode("")), "La ville est obligatoire");
        require(_price > 50000, "Erreur, le prix du bien immo doit etre superieur a 50000");
        
        _realEstateIds.increment();

        // Création du bien immo
        RealEstate memory newRealEstate;
        newRealEstate.id            = _realEstateIds.current();
        newRealEstate.name          = _name;
        newRealEstate.location      = _location;
        newRealEstate.city          = _city;
        newRealEstate.price         = _price;

        // Ajout du bien au catalogue
        realEstatesCollection.push(newRealEstate);

        // Evenement RealEstateAdd avec position de l'élément dans le tableau  
        uint indexRealEstateInCollection = _realEstateIds.current() - 1;
        emit RealEstateAdded(indexRealEstateInCollection);
    }

    // Calculer le nombre de token à minter par type de carte en fonction du prix du bien, du prix du token demandé par l'admin et du ratio (pourcentage du prix du bien)
    function createCards (uint256 _indexRealEstateInCollection, bool _isDefaultSupply, uint256 _ratioTokenCottage, uint256 _ratioTokenVilla, uint256 _ratioTokenMansion, uint256 _prixTokenCottage, uint256 _prixTokenVilla, uint256 _prixTokenMansion, uint256 _prixTokenHighRise) public onlyOwner {
        require(_indexRealEstateInCollection <= realEstatesCollection.length, "Index du bien immobilier en dehors du tableau");
        require(_ratioTokenCottage < 100 && _ratioTokenVilla < 100 && _ratioTokenMansion < 100, "Erreur, un des pourcentages est a 0");

        uint256 realEstatePrice = realEstatesCollection[_indexRealEstateInCollection].price;

        // Si les ratios ne sont pas renseignés, on prend les ratios par défaut
        if(_ratioTokenCottage == 0 && _ratioTokenVilla == 0 && _ratioTokenMansion == 0) {
            _ratioTokenCottage = DEFAULT_RATIO_COTTAGE_TOKENS;
            _ratioTokenVilla = DEFAULT_RATIO_VILLA_TOKENS;
            _ratioTokenMansion = DEFAULT_RATIO_MANSION_TOKENS;
        } 

        Card CottageCard = Card(CARD_COTTAGE, _prixTokenCottage, 0, _ratioTokenCottage);
        Card VillaCard = Card(CARD_VILLA, _prixTokenVilla, 0, _ratioTokenVilla);
        Card MansionCard = Card(CARD_MANSION, _prixTokenMansion, 0, _ratioTokenMansion);
        Card HighRiseCard = Card(CARD_HIGH_RISE, _prixTokenHighRise, 1, 0);

        Card[4] memory _cards;
        _cards.push(CottageCard);
        _cards.push(VillaCard);
        _cards.push(MansionCard);
        _cards.push(HighRiseCard);
        CalculateNumberOfToken(_cards, realEstatePrice, _prixTokenHighRise);

        cards[_indexRealEstateInCollection] = _cards;

        emit supplyCardsCalculated(_indexRealEstateInCollection, nbTokensMaxByTypeCard[CARD_COTTAGE], nbTokensMaxByTypeCard[CARD_VILLA], nbTokensMaxByTypeCard[CARD_MANSION], nbTokensMaxByTypeCard[CARD_HIGH_RISE]);
    }

    // Pour chaque bien immo, calcul du nombre de token à minter pour chaque type de carte 
    // TODO : vérifier les divisions (*1000) voir pour arrondir au supérieur    
    // TODO : vérifier controle require sur ratio > 0
    /// _realEstatePrice : Prix du bien immobilier à tokeniser (ex : 1 000 000 €)
    /// _tokenPrice : prix de la carte spécifiée par l'administrateur (ex : 50 €)
    /// _realEstatePriceRatio : Purcentage du prix du bien concerné (50%)
    /// SUr 50% du prix du bien (1 000 000 €), l'administrateur souhaite calculer le nombre de token de 50 € (supply)
    function CalculateNumberOfToken(Card[4] _cards, uint _realEstatePrice, uint _prixTokenHighRise) public view onlyOwner {
        require(_realEstatePrice >= 50000, "Erreur, le prix minimum du bien immobilier est de 50000");
        require(_tokenPrice >= 50, "Erreur, le prix minimum de vente est 50");
        require(_realEstatePriceRatio <= 100, "Erreur, le pourcentage doit etre inferieur a 100 pourcents");
        
        // Pour le calcul de la supply, on retire du prix du bien, le prix du token unique HighRise
        uint price = _realEstatePrice - (1 * _prixTokenHighRise); 

        for(i = 0; i < cards.length; i++){
            Card card = cards[i];
            if(card.numberOfTokens == 0){
                uint ratioMultiplier = card.ratioOfTokensInPercent * 100; // 50 % devient 5000
                uint256 value = price * ratioMultiplier / 10000; // On applique le ratio sur le prix du prix et on divise  
                uint256 numberOfTokens = value / _tokenPrice; // Prix du bien divisé par le prix du token
                card.numberOfTokens = numberOfTokens;
            }
        }
    }

    // L'administrateur minte les NFTS d'une collection (d'un bien immo)
    function mintRealEstateCollection(uint _indexRealEstateInCollection) public onlyOwner {

        Mint(msg.sender, CARD_COTTAGE, _indexRealEstateInCollection);
        Mint(msg.sender, CARD_VILLA, _indexRealEstateInCollection);
        Mint(msg.sender, CARD_MANSION, _indexRealEstateInCollection);
        Mint(msg.sender, CARD_HIGH_RISE, _indexRealEstateInCollection);

        emit tokenMinted(_indexRealEstateInCollection);
    }

    function Mint(address _contractOwner, uint256 _cardId, uint _indexRealEstateInCollection) private onlyOwner returns (uint256)
    {
        require (_cardId >= CARD_COTTAGE && _cardId <= CARD_HIGH_RISE, "Carte inconnue");

        _tokenIds.increment();

        // Mint des tokens pour un type de carte donné
        Card[4] cards = cards[_indexRealEstateInCollection];
        uint256 numberOfTokens = cards[_cardId].numberOfTokens;
        cards.tokenId = _tokenIds.current();
        _mint(_contractOwner, cards.tokenId, numberOfTokens, "");

        //_setTokenRoyalty(tokenId, msg.sender, 1000);
 
        return tokenId;
    }    

    // Frais de transactions
    function setFee(uint _fee) public onlyOwner {
        fees = _fee;
    }

    /**
     * Returns the latest price MATIC/USD
     */
    function getLatestPrice() public view returns (int) {
        (,/*uint80 roundID*/ int price /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,,,) = priceFeed.latestRoundData();
        return price;
    }
}

contract Marketplace is ERC1155, Rock {

    mapping (uint => sellList) public sales; 
    uint256 public salesId;

    struct sellList {
        address seller;
        address token;
        uint256 tokenId;
        uint256 amountOfToken;
        uint256 price;
        bool isSold;
    }

    struct NFTMarketItem {
        uint256 tokenId;
        uint256 nftId;
        uint256 amount;
        uint256 price;
        uint256 royalty;
        address payable seller; // Vendeur
        address payable owner; 
        bool forSale;
    }

    NFTMarketItem[] Nfts;
    
    function getRealStatebyId(uint _index) public view returns (RealEstate memory){
        return realEstatesCollection[_index];
    }

    // Exemple 
    function getTotalPriceInMatic(uint256 _amount){
        int lastprice = getLatestPrice();
        // if(lastprice > 0)
    }
    
    /// Fonction permettant d'acheter une ou plusieurs cartes NFT
    /// 
    /// _tokenId[] : les cartes achetées
    /// _amount[] : montants correspondants
    function buy(address _from, address _recipient, uint256[] _cardsId, uint256[] _amounts, uint _indexRealEstateInCollection) public payable returns (uint256) {
        require (amount > 0, "Le montant doit etre superieur a 0");
        require(_recipient != address(0), "ERC1155: address zero is not a valid owner");
        require (_cardId >= CARD_COTTAGE && _cardId <= CARD_HIGH_RISE, "Carte inconnue");

        // Liste des cartes du bien immo
        cards = cards[_indexRealEstateInCollection]:

        // Calcul du nombre de tokens MATIC à nous reverser au total
        // 3 cartes COTTAGE de 50 € et 1 carte VILLA
        uint totalAmount;
        for(uint i = 0; i <= _cardsId.length ; i++){
            uint boughtCardId = _cardsId[i];
            Card boughtCard =  cards[boughtCardId];
            totalAmount += boughtCard.price * _amounts[i];
        }

        // On vérifie que la balance de l'acheteur est supérieure ou égale à ce montant x


        //  si balance suffisante
        
            // Première transaction pour débiter le wallet du montant x et nous le reverser sur le smartcontract

            // Deuxième transaction pour lui transférer le nombre de _amount de _tokenId


        // sinon 



    
        if(lastprice > 0)
            lastprice = lastprice / 1000 = 
        _safeTransferFrom(_from, _to, _id, _amount, "");
        return _amount;
    }

    function sell(address _from, address _to, uint256 _id, uint256 _amount) public payable returns (uint256) {
        // Montant 
        //uint256 amount = _amount * fees / 1000;
        _safeTransferFrom(_from, _to, _id, _amount, "");
        return _amount;
    }

    function fetchAll() public view {
        // TODO
    }

    function fetchMyNfts() public view {
        //uint256[] memory ids;
        //balanceOfBatch(msg.sender, ids);
    }
}
