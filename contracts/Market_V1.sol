// contracts/Market.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";



import "hardhat/console.sol";

contract NFTMarket_V1 is ReentrancyGuardUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _itemIds;
    CountersUpgradeable.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice;
    // mapping(address => mapping(uint => string)) private _tokenData;
      /// @custom:oz-upgrades-unsafe-allow constructor
    // constructor() initializer {}

    function initialize() initializer public {
        __ReentrancyGuard_init();
        owner = payable(msg.sender);
        listingPrice  = 0.025 ether;
    }

    
    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    MarketItem[] marketItems;

    mapping(uint256 => MarketItem) private idToMarketItem;
    event ListingPriceChanged(uint);
    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    function changeListingPrice(uint _listingPrice) public {
        require(msg.sender == owner, "only owner can change the price");
         listingPrice  = _listingPrice;
         emit ListingPriceChanged(listingPrice);
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Places an item for sale on the marketplace */
    function createMarketItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        // _tokenData[nftContract][tokenId] = uri;
        idToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            false
        );

        IERC721Upgradeable(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            address(0),
            price,
            false
        );
    }
//Using the ERC721 URI Storage to fetch the data 
    function getTokenData(
        address nftContract,
        uint tokenId
        ) 
        public view returns(string memory)
        {
  
    return  ERC721URIStorageUpgradeable(nftContract).tokenURI(tokenId);
  
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(address nftContract, uint256 itemId)
        public
        payable
        nonReentrant
    {
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );

        idToMarketItem[itemId].seller.transfer(msg.value);
        IERC721Upgradeable(nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

     //transfer token to addres
    function transferMarketSale(address nftContract, uint256 itemId, address to)
        public
        nonReentrant
    {
         MarketItem memory tokenMarketData = idToMarketItem[itemId];
        require(msg.sender == tokenMarketData.seller,"You can only trnasfer your tokens");
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        

        
        IERC721Upgradeable(nftContract).transferFrom(address(this), to, tokenId);
        idToMarketItem[itemId].owner = payable(to);
        
        _itemsSold.increment();
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has created */
    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

//Returning the data by marketoken id 
    function fetchTokeByID(uint256 Tokenid)
        public
        view
        returns (
            uint256 itemId,
            address nftContract,
            address payable seller,
            uint256 price,
            bool sold,
            address owner
        )
    {
        MarketItem memory tokenMarketData = idToMarketItem[Tokenid];
        

        return (tokenMarketData.itemId, tokenMarketData.nftContract, tokenMarketData.seller, tokenMarketData.price, tokenMarketData.sold, tokenMarketData.owner);
    }
}
