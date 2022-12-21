// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/token/common/ERC2981.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
//import "../node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


/// @title Contrat d'administration de la plateforme ROCK
/// @author Alexandre NICAISE / ALEXANDRA GAUTHIER-POINT
/// @notice Contract used for manage real estates and tokens

contract Rock is ERC1155, ERC2981, Ownable, ReentrancyGuard {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _realEstateIds;
    
    uint256 internal fees = 5000; // 5%

    // Nom de la collection ROCK (qui apparaitra sur Opensea
    string public name = "Rock Collection";
    string public symbol = "Rock";

    // Programme immo
    struct RealEstate {
        uint256 id;
        string name; // Nom du programme immo
        string location; // Localisation
        string city; // Ville
        string cid;
        uint256 price; // Prix du bien
    }

    // Notre parc de biens immobilier
    RealEstate[] public realEstatesCollection;

    struct Card {
        uint256 tokenId;
        uint256 cardId;
        uint256 price;
        uint256 numberOfTokens;
        uint256 ratioOfTokensInPercent;
        uint256 royalty;
        uint256 balance;
    }

    // Tous les nfts listés sur la plateforme ROCK
    struct NFTCard {
        uint256 tokenId;
        uint256 price;
        uint256 quantity;
        address payable seller;
        address payable owner;
    }

    //NFTCard[] public Listings;


    // Cartes NFT detenues par les utilisateurs : Mapping realEstateId => ownerAdress => tokenId  --> Card
    mapping(uint256 => mapping(address => mapping(uint256 => NFTCard))) public usersCardsNfts;

    // Index du bien => tableau de cartes
    mapping(uint256 => Card[4]) internal cards;

    // Type de carte
    uint256 internal constant CARD_COTTAGE = 0;
    uint256 internal constant CARD_VILLA = 1;
    uint256 internal constant CARD_MANSION = 2;
    uint256 internal constant CARD_HIGH_RISE = 3;

    // Répartion des tokens par type de carte
    uint256 private constant DEFAULT_RATIO_COTTAGE_TOKENS = 50;
    uint256 private constant DEFAULT_RATIO_VILLA_TOKENS = 30;
    uint256 private constant DEFAULT_RATIO_MANSION_TOKENS = 20;

    // Events
    event supplyCardsCalculated(
        uint256 idToken,
        uint256 supplyCottage,
        uint256 supplyVilla,
        uint256 supplyMansion,
        uint256 supplyHighRise
    );
    event tokenMinted(uint256 idRealEstate);
    event RealEstateAddnnvgbed(uint256 idRealEstate);

    AggregatorV3Interface internal priceFeed;

    constructor()
        ERC1155("https://gateway.pinata.cloud/ipfs/QmWQ5gbDhF59vongSgmQJMYRiiVpXmduYAU9gffwDTwnca/{id}.json")
    {
        // Royalties sur chaque NFT vendu
        _setDefaultRoyalty(msg.sender, 8000);
        
        // Data Feed Chainlink pour récupérer le MATIC/USD
        priceFeed = AggregatorV3Interface(
            // 0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada
            0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e //ETHUSD
        );
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool){
        return super.supportsInterface(interfaceId);
    }


    /// @notice L'administrateur déclare un nouveau bien immo sur la blockchain
    /// @param _name Nom du programme immobilier
    /// @param _location Description du bien immobilier
    /// @param _city Autres informations sur le biens
    /// @param _cid URL de l'image du bien
    /// @param _price Prix du bien immobilier

    function addRealEstate (string memory _name, string memory _location, string memory _city, string memory _cid, uint256 _price) public  {

        require(keccak256(abi.encode(_name)) != keccak256(abi.encode("")), "Le nom du programme immobilier est obligatoire" );
        require(keccak256(abi.encode(_location)) != keccak256(abi.encode("")), "La situation est obligatoire");
        require(keccak256(abi.encode(_city)) != keccak256(abi.encode("")), "La ville est obligatoire");
        require(keccak256(abi.encode(_cid)) != keccak256(abi.encode("")), "Le cid est obligatoire");
        require(_price > 500, "Erreur, le prix du bien immo doit etre superieur a 500"); // 500 pour la soutenance sinon 50 000

        _realEstateIds.increment();

        /// Ajout d'un nouveau bien immobilier
        RealEstate memory newRealEstate;
        newRealEstate.id = _realEstateIds.current();
        newRealEstate.name = _name;
        newRealEstate.location = _location;
        newRealEstate.city = _city;
        newRealEstate.cid = _cid;
        newRealEstate.price = _price;

        /// Ajout du bien au catalogue
        realEstatesCollection.push(newRealEstate);

        /// Evenement RealEstateAdd avec position de l'élément dans le tableau
        uint256 indexRealEstateInCollection = _realEstateIds.current() - 1;

        emit RealEstateAdded(indexRealEstateInCollection);
    }

    /// @notice Retourne le nombre de biens immobiliers
    /// @return uint256 Nombre de biens immobiliers enregistrés par l'administrateur
    function getRealEstatesCollectionCount() external view returns (uint256) {
        return realEstatesCollection.length;
    }

    /// @notice Retourne un bien immobilier en fonction de son index
    /// @param _index Index du programme immobilier
    /// @return uint256 Nombre de biens immobiliers enregistrés par l'administrateur
    function getRealStateById(uint256 _index) external view returns (RealEstate memory) {
        require ( _index < realEstatesCollection.length, "Bien immobilier inexistant");
        return realEstatesCollection[_index];
    }

    /// @notice Calculer le nombre de token à minter par type de carte en fonction du prix du bien, du prix du token demandé par l'admin et du ratio (pourcentage du prix du bien)
    /// @param _indexRealEstateInCollection Index du programme immobilier
    /// @param _isDefaultSupply Indique si l'on applique les ratio par defaut
    /// @param _ratioTokenCottage Proportion de cartes Cottage
    /// @param _ratioTokenVilla Proportion de cartes Villa
    /// @param _ratioTokenMansion Proportion de cartes Mansion
    /// @param _prixTokenCottage Prix de la carte Cottage
    /// @param _prixTokenVilla Prix de la carte Villa
    /// @param _prixTokenMansion Prix de la carte Mansion
    /// @param _prixTokenHighRise Prix de la carte unique HighRise

    function calculateNumberOfTokens(
        uint256 _indexRealEstateInCollection,
        bool _isDefaultSupply,
        uint256 _ratioTokenCottage,
        uint256 _ratioTokenVilla,
        uint256 _ratioTokenMansion,
        uint256 _prixTokenCottage,
        uint256 _prixTokenVilla,
        uint256 _prixTokenMansion,
        uint256 _prixTokenHighRise) public onlyOwner {

        require(_indexRealEstateInCollection <= realEstatesCollection.length,"Index du bien immobilier en dehors du tableau");
        require(_ratioTokenCottage < 100 && _ratioTokenVilla < 100 && _ratioTokenMansion < 100, "Erreur, un des pourcentages est a 0");
        require(_prixTokenCottage >= 50, "Erreur, le prix minimum de la carte COTTAGE doit etre de 50");
        require(_prixTokenVilla >= 100, "Erreur, le prix minimum de la carte VILLA doit etre de 100" );
        require(_prixTokenMansion >= 150, "Erreur, le prix minimum de la carte MANSION doit etre de 150");

        /// Si les ratios ne sont pas renseignés par l'administrateur, on applique les ratios par défaut
        if (_isDefaultSupply || (_ratioTokenCottage == 0 && _ratioTokenVilla == 0 && _ratioTokenMansion == 0)) {
             _ratioTokenCottage = DEFAULT_RATIO_COTTAGE_TOKENS;
            _ratioTokenVilla    = DEFAULT_RATIO_VILLA_TOKENS;
            _ratioTokenMansion  = DEFAULT_RATIO_MANSION_TOKENS;
        }

        /// Création des cartes NFT
        Card[4] storage newCards    = cards[_indexRealEstateInCollection];
        newCards[CARD_COTTAGE]      = Card(CARD_COTTAGE, 0, _prixTokenCottage, 0, _ratioTokenCottage, 30, 0);
        newCards[CARD_VILLA]        = Card(CARD_VILLA, 0, _prixTokenVilla, 0,_ratioTokenVilla, 30, 0);
        newCards[CARD_MANSION]      = Card(CARD_MANSION, 0, _prixTokenMansion, 0, _ratioTokenMansion, 30, 0);
        newCards[CARD_HIGH_RISE]    = Card(CARD_HIGH_RISE, 0, _prixTokenHighRise, 1, 0, 30, 0);
 
        /// Pour le calcul du nombre de tokens par carte,
        /// on soustrait du prix du bien, le prix du token de la carte unique HighRise
        uint256 realEstatePrice = realEstatesCollection[ _indexRealEstateInCollection].price - (1 * _prixTokenHighRise);
        uint256 multiplier = 100;

        /// Enregistrement des informations renseignees par l'administrateur
        for (uint256 i = 0; i < CARD_HIGH_RISE; i++) {
            Card storage card = cards[_indexRealEstateInCollection][i];
            if (card.numberOfTokens == 0) {
                uint256 ratioMultiplier = card.ratioOfTokensInPercent * multiplier; /// 50 % devient 5000
                uint256 priceByCard     = (realEstatePrice * ratioMultiplier) / (100 * multiplier); /// On applique le ratio sur le prix du prix et on divise
                uint256 numberOfTokens  = priceByCard / card.price; /// Prix du bien divisé par le prix du token
                card.numberOfTokens     = numberOfTokens;
            }
        }

        emit supplyCardsCalculated(
            _indexRealEstateInCollection,
            newCards[CARD_COTTAGE].numberOfTokens,
            newCards[CARD_VILLA].numberOfTokens,
            newCards[CARD_MANSION].numberOfTokens,
            newCards[CARD_HIGH_RISE].numberOfTokens
        );
    }

    /// @notice Minter les 4 cartes NFT correspondant à un bien immobilier
    /// @param _indexRealEstateInCollection Index du programme immobilier
    function mintRealEstateCollection(uint256 _indexRealEstateInCollection) public onlyOwner  {
        require( _indexRealEstateInCollection <= realEstatesCollection.length,  "Index du bien immobilier en dehors du tableau");
        require(cards[_indexRealEstateInCollection][0].tokenId == 0, "Le mint a deja ete effectue");

        mintCard(CARD_COTTAGE, _indexRealEstateInCollection);
        mintCard(CARD_VILLA, _indexRealEstateInCollection);
        mintCard(CARD_MANSION, _indexRealEstateInCollection);
        mintCard(CARD_HIGH_RISE, _indexRealEstateInCollection);

        emit tokenMinted(_indexRealEstateInCollection);
    }


    /// @notice Minter une carte NFT correspondant à un bien immobilier
    /// @param _cardId Index de la carte à minter
    /// @return uint256 Retourne l'identifiant du token créé
    function mintCard(uint256 _cardId, uint256 _indexRealEstateInCollection) private onlyOwner returns (uint256) {

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        address contractOwner = owner();

        /// Mint des tokens pour un type de carte donné
        uint256 numberOfTokens = cards[_indexRealEstateInCollection][_cardId] .numberOfTokens;
        cards[_indexRealEstateInCollection][_cardId].tokenId = newTokenId;
        _mint(contractOwner, newTokenId, numberOfTokens, "");

        /// Mise à jour de la balance totale de la carte NFT (Quantité restante égale au nombre de tokens mintés)
        uint256 balanceOfOwnerTokenId = balanceOf(contractOwner, cards[_indexRealEstateInCollection][_cardId].tokenId);

        /// NFT qui seront listés sur la plateforme une fois le mint effectué
        /// Par défaut tous les NTFS sont déténus par le owner du contrat
        /// realEstateId => ownerAdress --> tokenId => Card
        NFTCard storage defaultOwner = usersCardsNfts[_indexRealEstateInCollection][contractOwner][newTokenId];
        defaultOwner.tokenId = cards[_indexRealEstateInCollection][_cardId].tokenId; /// Identifiant de la carte mintée
        defaultOwner.price = cards[_indexRealEstateInCollection][_cardId].price; /// Prix défini par l'administrateur
        defaultOwner.quantity = balanceOfOwnerTokenId; /// balance du owner du token
        defaultOwner.owner = payable(contractOwner);
        defaultOwner.seller = payable(contractOwner);

        /// MAJ du mapping des balances
        cards[_indexRealEstateInCollection][_cardId].balance = balanceOfOwnerTokenId;

        return newTokenId;
    }

    /// @notice Retourne une carte NFT correspondant à un bien immobilier
    /// @param _indexRealEstateInCollection Index du bien immobilier
    /// @param _cardId Index de la carte NFT
    /// @return Card Retourne une structure Card
    function getCard (uint256 _indexRealEstateInCollection, uint256 _cardId) public view returns (Card memory) {
        Card memory card = cards[_indexRealEstateInCollection][_cardId];
        return card;
    }

    /// @notice Mettre à jour les frais de la plateforme
    /// @param _fee Montant des frais de la plateforme
    function setFee(uint256 _fee) public onlyOwner {
        fees = _fee;
    }

    /// @notice Retourne le dernier prix de la paire ETH USD en wei
    /// @return int256 Dernier connu prix de la paire ETH USD en wei
    function getLatestPrice() public view returns (int256) {
        (
            ,
            /*uint80 roundID*/
            int256 price, /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/
            ,
            ,

        ) = priceFeed.latestRoundData();
        return price;
    }

    /// @notice fonction Withdraw pour retirer les eth
    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "Balance a 0");
        payable(owner()).transfer(address(this).balance);
    }

    /// @notice Retourne le owner du contrat - TODO A supprimer car hérite de OWnable
    /// @return Adresse du owner du contrat
    function getOwner() public view returns (address) {
        return owner();
    }
}
