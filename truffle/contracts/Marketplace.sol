// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Rock.sol";

/// @title Contrat permettant de gérer la marketplace
/// @author Alexandre NICAISE / ALEXANDRA GAUTHIER-POINT
/// @notice Contract used for manage the marketplace

contract Marketplace is Rock {
    // Events
    event CardPurchased(
        uint256[] indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256[] quantities,
        uint256 totalPrice
    );

    /// @notice Verifier que la quantité souhaitée par l'acheteur est bien disponible dans la balance du vendeur
    /// @param _indexRealEstateInCollection Index du bien immobilier
    /// @param tokenId Identifiant du token
    /// @param sellerAddress Adresse du vendeur pour vérifier sa balance
    /// @param askedQuantity Quantité demandée par l'acheteur
    /// @return Inqique si la quantité de cartes demandée  est en stock suffisant
    function verifyUserQuantityIsAvailable(uint256 _indexRealEstateInCollection, uint256 tokenId, address sellerAddress, uint256 askedQuantity) public view returns (bool) {
        NFTCard storage userCard = usersCardsNfts[_indexRealEstateInCollection][sellerAddress][tokenId];
        if (askedQuantity <= userCard.quantity) {
            return true;
        }
        return false;
    }

    /// @notice Procéder au paiement des cartes NFT
    /// @param _tokenIds Cartes achetées
    /// @param _quantities Quantitées achetées
    /// @param _indexRealEstateInCollection Index du bien immobilier
    function confirmBuy(uint256[] calldata _tokenIds, uint256[] calldata _quantities, uint256 _indexRealEstateInCollection) external payable {

        address buyer = payable(msg.sender);
        address seller = payable(owner());

        bool amountAvailable = false;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(_quantities[i] > 0, "La quantite de token doit etre superieure a 0");

            /// Vérification de la balance du vendeur
            amountAvailable = verifyUserQuantityIsAvailable(_indexRealEstateInCollection,  _tokenIds[i], seller, _quantities[i]);
            
            require(amountAvailable, "La quantite de tokens detenue est insuffisante");
        }

        /// L'acheteur (msg.sender) envoie 2 ethers au propiétaire du NFT
        (bool sentToPlateform, ) = payable(seller).call{value: msg.value}("");

        /// La transaction doit avoir reussi pour ontinuer le transfert des NFT
        require(sentToPlateform, "Le paiement de la transaction vers le contrat a echoue");

        /// Distribution des NFT achetés
        distributeTokens(buyer, seller, _tokenIds, _quantities, _indexRealEstateInCollection);

        emit CardPurchased(_tokenIds, buyer, seller, _quantities, msg.value);
    }

    /// @notice Distribuer les tokens aprés le paiement effectué 
    /// @param buyer Adresse de l'acheteur
    /// @param seller Adresse du vendeur
    /// @param _tokenIds Cartes achetées
    /// @param _quantities Quantitées de cartes achetées à redistribuer
    /// @param _indexRealEstateInCollection Index du bien immobilier
    function distributeTokens (address buyer, address seller, uint256[] calldata _tokenIds, uint256[] calldata _quantities, uint256 _indexRealEstateInCollection) private { 

        /// Les tokens appartenant à l'owner, il est nécessaire d'approuver le buyer pour que le transfert puisse se faire
        _setApprovalForAll(buyer, seller, true);

        /// Transfert des tokens vers l'acheteur
        _safeBatchTransferFrom(seller, buyer, _tokenIds, _quantities, "");

        /// MAJ des balances
       for (uint256 i = 0; i < _tokenIds.length; i++) {

            // Mise à jour de la balance du vendeur
            NFTCard storage sellerTokens = usersCardsNfts[_indexRealEstateInCollection][seller][_tokenIds[i]];
            sellerTokens.quantity -= _quantities[i];
            sellerTokens.seller = payable(seller);
            sellerTokens.owner = payable(buyer);

            // Mise à jour de la balance de l'acheteur
            NFTCard storage buyTokens = usersCardsNfts[_indexRealEstateInCollection][buyer][_tokenIds[i]];
            buyTokens.quantity += _quantities[i];
            buyTokens.seller = payable(buyer);
            buyTokens.owner = payable(buyer);
        }
    }

    /// @notice Afficher la liste des tokens détenus par un investisseur
    /// @param _indexRealEstateInCollection Index du bien immobilier
    function fetchMyNfts(uint256 _indexRealEstateInCollection) public view returns (NFTCard[4] memory) {
        
        NFTCard[4] memory myNFTCards;

        // Récupération du solde des 4 cartes du bien immobilier passé en paramètre
        uint idToken = 0;
        for(uint i = 0; i < 4; i++){
           idToken = i + 1; 
           myNFTCards[i] = usersCardsNfts[_indexRealEstateInCollection][msg.sender][idToken];  
        }

        return myNFTCards;
    }

    /// Cette fonction doit mettre à jour les differentes balances aprés un achat ou aprés une vente
    function updateBalances() private onlyOwner {}

    /// Cette fonction doit pouvoir afficher la liste des NFT  disponibles à la vent
    function fetchAllAvailableyNfts() public view {

    }

    /// Le contrat pourra recevoir des fonds
    receive() external payable {}
}
