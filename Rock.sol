// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

contract Rock is ERC1155, ERC2981, Ownable, ReentrancyGuard {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _realEstateIds;
    uint256 internal fees = 5000; // 5%

    // Nom de la collection ROCK (qui apparaitra sur Opensea
    string public name      = "Rock Collection";
    string public symbol    = "Rock";

    // Programme immo
    struct RealEstate {
        uint    id;
        string  name;           // Nom du programme immo
        string  location;       // Localisation 
        string  city;           // Ville
        uint256 price;          // Prix du bien
        uint256 numberOfLike;   // Taux d'influence
    }
    
    // Notre parc de biens immobilier
    RealEstate[] public realEstatesCollection;

    // Index du bien => tableau de cartes
    mapping(uint256 => Card[4]) internal cards;

    struct Card {
        uint256 cardId;
        uint256 tokenId;
        uint256 price;
        uint256 numberOfTokens;
        uint256 ratioOfTokensInPercent;
        uint256 royalty;
        address payable seller;
        address payable owner; 
        bool isListed;
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
    
    // Events
    event supplyCardsCalculated (uint256 idToken, uint256 supplyCottage, uint256 supplyVilla, uint256 supplyMansion, uint256 supplyHighRise);
    event tokenMinted (uint256 idRealEstate);
    event RealEstateAdded (uint256 idRealEstate);

    AggregatorV3Interface internal priceFeed;

    constructor() ERC1155("https://gateway.pinata.cloud/ipfs/QmYF4vRAZg19ARiSFoXevZYkf9Zp1yVdgXhh4x22bypMc4/{id}.json") {
        // Royalties sur chaque NFT vendu
        _setDefaultRoyalty(msg.sender, 8000);
        // Data Feed Chainlink pour récupérer le MATIC/USD
        priceFeed = AggregatorV3Interface(0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool) {
      return super.supportsInterface(interfaceId);
    }

    // L'administrateur déclare un nouveau bien immo sur la blockchain
    // Retourne l'index du bien immo
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
    function calculateNumberOfTokens (uint256 _indexRealEstateInCollection, bool _isDefaultSupply, uint256 _ratioTokenCottage, uint256 _ratioTokenVilla, uint256 _ratioTokenMansion, uint256 _prixTokenCottage, uint256 _prixTokenVilla, uint256 _prixTokenMansion, uint256 _prixTokenHighRise) public onlyOwner {
        require(_indexRealEstateInCollection <= realEstatesCollection.length, "Index du bien immobilier en dehors du tableau");
        require(_ratioTokenCottage < 100 && _ratioTokenVilla < 100 && _ratioTokenMansion < 100, "Erreur, un des pourcentages est a 0");
        require(_prixTokenCottage >= 50, "Erreur, le prix minimum de la carte COTTAGE doit etre de 50");
        require(_prixTokenVilla >= 100, "Erreur, le prix minimum de la carte VILLA doit etre de 100");
        require(_prixTokenMansion >= 150, "Erreur, le prix minimum de la carte MANSION doit etre de 150");

        // Si les ratios ne sont pas renseignés par l'administrateur, on prend les ratios par défaut
        if(_isDefaultSupply || (_ratioTokenCottage == 0 && _ratioTokenVilla == 0 && _ratioTokenMansion == 0)) {
            _ratioTokenCottage = DEFAULT_RATIO_COTTAGE_TOKENS;
            _ratioTokenVilla = DEFAULT_RATIO_VILLA_TOKENS;
            _ratioTokenMansion = DEFAULT_RATIO_MANSION_TOKENS;
        } 

        // Création des cartes
        Card[4] storage newCards = cards[_indexRealEstateInCollection];
        newCards[CARD_COTTAGE] = Card(CARD_COTTAGE, 0, _prixTokenCottage, 0, _ratioTokenCottage, 30, payable(msg.sender), payable(msg.sender), true);
        newCards[CARD_VILLA] = Card(CARD_VILLA, 0, _prixTokenVilla, 0, _ratioTokenVilla, 30,payable(msg.sender), payable(msg.sender), true);
        newCards[CARD_MANSION] = Card(CARD_MANSION, 0, _prixTokenMansion, 0, _ratioTokenMansion, 30, payable(msg.sender), payable(msg.sender), true);
        newCards[CARD_HIGH_RISE] = Card(CARD_HIGH_RISE, 0, _prixTokenHighRise, 1, 0, 30, payable(msg.sender), payable(msg.sender), true);

        // Pour le calcul du nombre de tokens par carte, 
        // on soustrait du prix du bien, le prix du token de la carte unique HighRise
        uint realEstatePrice = realEstatesCollection[_indexRealEstateInCollection].price - (1 * _prixTokenHighRise); 
        uint256 multiplier = 100;

        for(uint i = 0; i < CARD_HIGH_RISE; i++){
            Card storage card = cards[_indexRealEstateInCollection][i];
            if(card.numberOfTokens == 0){
                uint ratioMultiplier = card.ratioOfTokensInPercent * multiplier; // 50 % devient 5000
                uint256 priceByCard = realEstatePrice * ratioMultiplier / (100*multiplier); // On applique le ratio sur le prix du prix et on divise  
                uint256 numberOfTokens = priceByCard / card.price; // Prix du bien divisé par le prix du token
                card.numberOfTokens = numberOfTokens;
            }
        }

        emit supplyCardsCalculated(_indexRealEstateInCollection, newCards[CARD_COTTAGE].numberOfTokens, newCards[CARD_VILLA].numberOfTokens, newCards[CARD_MANSION].numberOfTokens, newCards[CARD_HIGH_RISE].numberOfTokens);
    }

    // L'administrateur minte les NFTS d'une collection (d'un bien immo)
    function mintRealEstateCollection(uint _indexRealEstateInCollection) public onlyOwner {
        require(_indexRealEstateInCollection <= realEstatesCollection.length, "Index du bien immobilier en dehors du tableau");
        require(cards[_indexRealEstateInCollection][0].tokenId == 0, "Le mint a deja ete effectue");
        
        mintCard(msg.sender, CARD_COTTAGE, _indexRealEstateInCollection);
        mintCard(msg.sender, CARD_VILLA, _indexRealEstateInCollection);
        mintCard(msg.sender, CARD_MANSION, _indexRealEstateInCollection);
        mintCard(msg.sender, CARD_HIGH_RISE, _indexRealEstateInCollection);

        emit tokenMinted(_indexRealEstateInCollection);
    }

    function mintCard(address _contractOwner, uint256 _cardId, uint _indexRealEstateInCollection) private onlyOwner returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Mint des tokens pour un type de carte donné
        uint256 numberOfTokens = cards[_indexRealEstateInCollection][_cardId].numberOfTokens;
        cards[_indexRealEstateInCollection][_cardId].tokenId = newTokenId; 
        _mint(_contractOwner, newTokenId, numberOfTokens, "");
 
        return newTokenId;
    }    

    // Frais de transactions de la plateforme ROCK
    function setFee(uint _fee) public onlyOwner {
        fees = _fee;
    }

    /// Returns the latest price MATIC/USD
    function getLatestPrice() public view returns (uint) {
        (
            /*uint80 roundID*/,
            int price,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = priceFeed.latestRoundData();
        uint8 decimals = priceFeed.decimals();
        uint _price = uint(price);
        return _price/(10**decimals);
        //return _price;
        // return _amount / maticPrice;
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance a 0");
        payable(owner()).transfer(address(this).balance);
    }
}
