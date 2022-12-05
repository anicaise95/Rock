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
    event CardPurchased(uint256[] indexed tokenId, address indexed buyer, address indexed seller, uint256[] cardsId, uint256[] quantities, uint256 totalPrice);
    
    // Dans le cadre d'une vendre, si Alice achete 2 cartes COTTAGE à BOB, on vérifie que Bob détient bien ces 2 cartes
    function verifyUserQuantityIsAvailable(uint256 _indexRealEstateInCollection, uint256 tokenId, address card0wnerAddress, uint256 askedQuantity) public view returns(bool) {
        NFTCard storage userCard = usersCardsNfts[_indexRealEstateInCollection][tokenId][card0wnerAddress];
        if(askedQuantity <= userCard.quantity){
            return true;
        } 
        return false;
    }

    // Cette fonction doit mettre à jour les differentes balances aprés un achat ou aprés une vente
    function updateBalances() private onlyOwner {

    }

    function distribute() private onlyOwner {

    }

    // Envoyer des fonds à une adresse
    /*function sendFunds(address _receiver, uint256 _amount) external payable {
        (bool sentToPlatform,) = payable(_receiver).call{value: _amount}('');
        require(sentToPlatform,"failed to pay the transaction to contract");
    }*/

    /// Fonction permettant d'acheter une ou plusieurs cartes NFT
    function buy (uint256[] calldata _cardsId, uint256[] calldata _quantities, uint _indexRealEstateInCollection) external payable {
        require (_cardsId.length > 0, "Aucune carte selectionnee");
        require (_quantities.length > 0, "Aucune quantite de NFT renseignee");
        require (_cardsId.length == _quantities.length, "Probleme dans les quantites et cartes a acheter : nombre de valeurs differentes");
        require(msg.sender != address(0), "You cannot order from this address!");
        
        // Calcul du prix total et on vérifie que la balance est suffisante pour procéder au transfert des tokens
        // uint256 totalPrice = calculeTotalPrice(_indexRealEstateInCollection, _cardsId, _quantities);
        uint256 totalPrice = 2;
        address buyer = payable(msg.sender);
        address seller = payable(owner());

        require(msg.value >= totalPrice, "Fonds insuffisants");
        
        // L'acheteur envoie 2 ethers au propiétaire du NFT
        //sendFunds(seller, msg.value);
        (bool sentToPlatform,) = payable(seller).call{value: totalPrice}('');
        require(sentToPlatform,"failed to pay the transaction to contract");

        // Si la transaction est validée, on transfère les tokens
                //_setApprovalForAll(cardOwner, recipient, true);

        //address cardOwner = "???";
        
        // Calcul des frais pour la plateforme
        //uint256 feesPrice = totalPrice * fees / 100;

        // Reversement des frais à la plateforme

        uint256[] memory tokenIds;

        for(uint i = 0; i < _cardsId.length; i++){
            require(_quantities[i] > 0, "La quantite de token doit etre superieure a 0");
            // Carte achetée
            uint256 cardId = _cardsId[i];
            // Token id correspondant
            uint256 tokenId = cards[_indexRealEstateInCollection][cardId].tokenId;
            tokenIds[i] = tokenId;
        }

        // Transfert de chaque carte au destinataire
        safeBatchTransferFrom(seller, buyer, tokenIds, _quantities, "");
        
        emit CardPurchased(tokenIds, buyer, seller, _cardsId, _quantities, totalPrice);
    }

    function sell (address _from, address _to, uint256 _id, uint256 _amount) public payable returns (uint256) {
       
        // Versement des royalties de 8% à ROCK pour chaque NFT vendu
        /*_setTokenRoyalty(newTokenId, msg.sender, 8000);

        uint amountToSeller = msg.value*(1-(platformFee/1000));
        uint amountToPlatform = msg.value*(platformFee/1000);

        (bool sentToSeller,) = payable(_seller).call{value:amountToSeller}("");
        require(sentToSeller,"failed to pay the transaction to seller");
        
        (bool sentToPlatform,) = payable(address(this)).call{value:amountToPlatform}("");
        require(sentToPlatform,"failed to pay the transaction to contract");

        _safeTransferFrom(_from, _to, _id, _amount, "");*/
        return 0;
    }

    function fetchAll () public view {
        // TODO
    }

    function fetchMyNfts () public view {
        //uint256[] memory ids;
        //balanceOfBatch(msg.sender, ids);
    }
}
