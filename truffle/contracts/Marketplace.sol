// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Rock.sol";

import "./Rock.sol";

//import "./ERC1155.sol";

contract Marketplace is Rock {
    // Events
    event CardPurchased(
        uint256[] indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256[] quantities,
        uint256 totalPrice
    );

    // Dans le cadre d'une vente, si Alice achete 2 cartes COTTAGE à BOB, on vérifie que Bob détient bien ces 2 cartes
    function verifyUserQuantityIsAvailable(
        uint256 _indexRealEstateInCollection,
        uint256 tokenId,
        address sellerAddress,
        uint256 askedQuantity
    ) public view returns (bool) {
        NFTCard storage userCard = usersCardsNfts[_indexRealEstateInCollection][
            sellerAddress
        ][tokenId];
        if (askedQuantity <= userCard.quantity) {
            return true;
        }
        return false;
    }

    /// Fonction permettant d'acheter une ou plusieurs cartes NFT
    function confirmBuy(
        uint256[] calldata _tokenIds,
        uint256[] calldata _quantities,
        uint256 _indexRealEstateInCollection
    ) external payable {
        address buyer = payable(msg.sender);
        address seller = payable(owner());

        bool amountAvailable = false;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            require(
                _quantities[i] > 0,
                "La quantite de token doit etre superieure a 0"
            );

            // Vérification de la balance du vendeur
            amountAvailable = verifyUserQuantityIsAvailable(
                _indexRealEstateInCollection,
                _tokenIds[i],
                seller,
                _quantities[i]
            );

            require(
                amountAvailable,
                "La quantite de tokens detenue est insuffisante"
            );
        }

        // L'acheteur (msg.sender) envoie 2 ethers au propiétaire du NFT
        (bool sentToPlateform, ) = payable(seller).call{value: msg.value}("");

        // La transaction doit avoir reussi pour ontinuer le transfert des NFT
        require(
            sentToPlateform,
            "Le paiement de la transaction vers le contrat a echoue"
        );

        // Distribution des NFT achetés
        distributeTokens(
            buyer,
            seller,
            _tokenIds,
            _quantities,
            _indexRealEstateInCollection
        );

        emit CardPurchased(_tokenIds, buyer, seller, _quantities, msg.value);
    }

    function distributeTokens(
        address buyer,
        address seller,
        uint256[] calldata _tokenIds,
        uint256[] calldata _quantities,
        uint256 _indexRealEstateInCollection
    ) private {
        // Les tokens appartenant à l'owner, il est nécessaire d'approuver le buyer pour que le transfert puisse se faire
        _setApprovalForAll(buyer, seller, true);
        // Transfert des tokens vers l'acheteur
        safeBatchTransferFrom(seller, buyer, _tokenIds, _quantities, "");

        // MAJ des balances
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            // Mise à jour de la balance du vendeur
            NFTCard storage sellerTokens = usersCardsNfts[
                _indexRealEstateInCollection
            ][seller][_tokenIds[i]];
            sellerTokens.quantity -= _quantities[i];
            sellerTokens.seller = payable(seller);
            sellerTokens.owner = payable(buyer);

            // Mise à jour de la balance de l'acheteur
            NFTCard storage buyTokens = usersCardsNfts[
                _indexRealEstateInCollection
            ][buyer][_tokenIds[i]];
            buyTokens.quantity += _quantities[i];
            buyTokens.seller = payable(buyer);
            buyTokens.owner = payable(buyer);
        }
    }

    function fetchAllAvailableyNfts() public view {}

    ///
    function fetchMyNfts(uint256 _indexRealEstateInCollection, address account)
        public
        view
        returns (NFTCard[] memory)
    {
        NFTCard[] memory myNFTCards;

        // Récupération du solde des 4 cartes du bien immobilier passé en paramètre
        for (uint256 tokenId = 1; tokenId <= 4; tokenId++) {
            myNFTCards[tokenId] = usersCardsNfts[_indexRealEstateInCollection][
                account
            ][tokenId];
        }
        return myNFTCards;
    }

    // Cette fonction doit mettre à jour les differentes balances aprés un achat ou aprés une vente
    function updateBalances() private onlyOwner {}

    // Le contrat pourra recevoir des fonds
    receive() external payable {}
}
