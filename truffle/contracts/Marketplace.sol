// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./Rock.sol";

contract Marketplace is Rock {
    // Events
    event CardPurchased(
        uint256[] indexed tokenId,
        address indexed buyer,
        address indexed seller,
        uint256[] cardsId,
        uint256[] quantities,
        uint256 totalPrice
    );

    // Cette fonction doit mettre à jour les differentes balances aprés un achat ou aprés une vente
    function updateBalances() private onlyOwner {}

    function distribute() private onlyOwner {}

    // Dans le cadre d'une vente, si Alice achete 2 cartes COTTAGE à BOB, on vérifie que Bob détient bien ces 2 cartes
    function verifyUserQuantityIsAvailable(
        uint256 _indexRealEstateInCollection,
        uint256 tokenId,
        address sellerAddress,
        uint256 askedQuantity
    ) public view returns (bool) {
        NFTCard storage userCard = usersCardsNfts[_indexRealEstateInCollection][
            tokenId
        ][sellerAddress];
        if (askedQuantity <= userCard.quantity) {
            return true;
        }
        return false;
    }

    /// Fonction permettant d'acheter une ou plusieurs cartes NFT
    function confirmBuy(
        uint256[] calldata _cardsId,
        uint256[] calldata _quantities,
        uint256 _indexRealEstateInCollection
    ) external payable {
        require(
            _cardsId.length > 0 &&
                _quantities.length > 0 &&
                _cardsId.length == _quantities.length,
            "Incoherence entre les cartes choisies et les quantites renseignees"
        );
        require(
            msg.sender != address(0),
            "You cannot order from this address!"
        );

        address buyer = payable(msg.sender);
        address seller = payable(owner());

        uint256[] memory tokenIds;
        bool amountAvailable = false;
        for (uint256 i = 0; i < _cardsId.length; i++) {
            require(
                _quantities[i] > 0,
                "La quantite de token doit etre superieure a 0"
            );
            // Carte achetée
            uint256 cardId = _cardsId[i];
            // Token id correspondant pour pouvoir etre transfert a l'acheteur
            uint256 tokenId = cards[_indexRealEstateInCollection][cardId]
                .tokenId;

            // Vérification de la balance du vendeur
            amountAvailable = verifyUserQuantityIsAvailable(
                _indexRealEstateInCollection,
                tokenId,
                seller,
                _quantities[i]
            );
            require(
                amountAvailable,
                "La quantite de tokens detenue est insuffisante"
            );
        }

        // Calcul du prix total et on vérifie que la balance est suffisante pour procéder au transfert des tokens
        // uint256 totalPrice = calculeTotalPrice(_indexRealEstateInCollection, _cardsId, _quantities);
        uint256 totalPrice = 2;
        require(msg.value >= totalPrice, "Fonds insuffisants");

        // L'acheteur (msg.sender) envoie 2 ethers au propiétaire du NFT
        (bool sentToPlateform, ) = payable(seller).call{value: msg.value}("");
        // La transaction doit avoir reussi pour ontinuer le transfert des NFT
        require(
            sentToPlateform,
            "Le paiement de la transaction vers le contrat a echoue"
        );

        // Transfert des tokens vers l'acheteur
        safeBatchTransferFrom(seller, buyer, tokenIds, _quantities, "");

        // MAJ des balances
        for (uint256 i = 0; i < tokenIds.length; i++) {
            // Mise à jour de la balance du vendeur
            NFTCard storage sellerTokens = usersCardsNfts[
                _indexRealEstateInCollection
            ][tokenIds[i]][seller];
            sellerTokens.quantity -= _quantities[i];
            sellerTokens.seller = payable(seller);
            sellerTokens.owner = payable(buyer);

            // Mise à jour de la balance de l'acheteur
            NFTCard storage buyTokens = usersCardsNfts[
                _indexRealEstateInCollection
            ][tokenIds[i]][buyer];
            buyTokens.quantity += _quantities[i];
            buyTokens.seller = payable(buyer);
            buyTokens.owner = payable(buyer);
        }

        emit CardPurchased(
            tokenIds,
            buyer,
            seller,
            _cardsId,
            _quantities,
            totalPrice
        );
    }

    function sellTokens(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount
    ) public returns (uint256) {
        // Une vente peut être réalisée si les tokens detenus par le vendeur ont plus de 6 mois ?

        return 0;
    }

    function fetchAll() public view {}

    function fetchMyNfts() public view {}

    // Le contrat pourra recevoir des fonds
    receive() external payable {}
}
