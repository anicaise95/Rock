  // SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

import "./Rock.sol";

contract Marketplace is Rock {

    mapping (uint => sellList) public sales; 
    uint256 public salesId;

    // Cartes en vente
    struct sellList {
        address seller;
        address token;
        uint256 tokenId;
        uint256 amountOfToken;
        uint256 price;
        bool isSold;
    }

    // Events
    event CardPurchased(uint[] indexed tokenId, address nftAddress, address indexed seller, uint[] cardsId, uint[] quantities, uint256 totalPrice);
    
    // Récupération du bien immobilier par son index
    function getRealStateById(uint _index) public view returns (RealEstate){
        require (_index < realEstatesCollection.length, "Bien immobilier inexistant");
        return realEstatesCollection[_index];
    }

    // Récupération de la paire MATIC / USD via Chainlink 
    function getLastPairMaticUsd(uint256 _amount) public pure returns (uint256) {
        return getLatestPrice();
    }

    // Retourne le prix total des cartes à payer (en MATIC)
    function calculeTotalPrice(uint256 _indexRealEstateInCollection, uint256[] calldata _cardsId, uint256[] calldata _amounts) public view returns (uint256) {
        require (_amounts.length > 0, "Aucun montant renseigne");
        require (_cardsId.length > 0, "Aucun carte selectionnee");
        require (_indexRealEstateInCollection < realEstatesCollection.length, "Bien immobilier inexistant");

        // 3 cartes COTTAGE de 50 € et 1 carte VILLA à 100 € = 3 * 50 + 1 * 100 = 250 = totalAmount
        uint totalAmount;

        for(uint i = 0; i < _cardsId.length ; i++){
            require (_cardsId[i] >= CARD_COTTAGE && _cardsId[i] <= CARD_HIGH_RISE, "Carte inconnue");
            uint boughtCardId = _cardsId[i];
            // amount = price * quantity
            totalAmount += cards[_indexRealEstateInCollection][boughtCardId].price * _amounts[i];
        }

        // Calcul du nombre de tokens MATIC à nous reverser au total
        // return amountOfMATIC(totalAmount);
        return totalAmount;
    }

    /// Fonction permettant d'acheter une ou plusieurs cartes NFT
    function buy(uint256[] calldata _cardsId, uint256[] calldata _quantities, uint _indexRealEstateInCollection) external payable {
        require (_cardsId.length > 0, "Aucune carte selectionnee");
        require (_quantities.length > 0, "Aucune quantite de NFT renseignee");
        require (_cardsId.length == _quantities.length, "Probleme dans les quantites et cartes a acheter : nombre de valeurs differentes");
        require(msg.sender != address(0), "You cannot order from this address!");
        
        // Calcul du prix total et on vérifie que la balance est suffisante pour procéder au transfert des tokens
        uint256 totalPrice = calculeTotalPrice(_indexRealEstateInCollection, _cardsId, _quantities);
        require(msg.value >= totalPrice, "Fonds insuffisants");
        
        address recipient = msg.sender;
        address cardOwner = "???";
        
        // Calcul des frais pour la plateforme
        uint256 feesPrice = totalPrice * fees / 100;

        // Reversement des frais à la plateforme




        // On approuve pour pouvoir valider le transfert
        _setApprovalForAll(cardOwner, recipient, true);
        
        uint[] memory tokenIds;

        for(uint i = 0; i < _cardsId.length; i++){
            require(_quantities[i] > 0, "La quantite de token doit etre superieure a 0");
            // Carte achetée
            uint256 cardId = _cardsId[i];
            // Token id correspondant
            uint256 tokenId = cards[_indexRealEstateInCollection][cardId].tokenId;
            tokenIds[i] = tokenId;
            // Transfert de chaque carte au destinataire
            safeTransferFrom(cardOwner, recipient, tokenId, _quantities[i], "");
        }
        
        emit CardPurchased(tokenIds, recipient, cardOwner, _cardsId, _quantities, totalPrice);
    }

    function sell(address _from, address _to, uint256 _id, uint256 _amount) public payable returns (uint256) {
       
        // Versement des royalties de 8% à ROCK pour chaque NFT vendu
        _setTokenRoyalty(newTokenId, msg.sender, 8000);

        uint amountToSeller = msg.value*(1-(platformFee/1000));
        uint amountToPlatform = msg.value*(platformFee/1000);

        (bool sentToSeller,) = payable(_seller).call{value:amountToSeller}("");
        require(sentToSeller,"failed to pay the transaction to seller");
        
        (bool sentToPlatform,) = payable(address(this)).call{value:amountToPlatform}("");
        require(sentToPlatform,"failed to pay the transaction to contract");

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
