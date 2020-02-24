pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;   // required to pass structs as function parameter and return values

import "./FECoin.sol";
// import "../../browser/FECoin.sol";  // remix

/// @title  ProofOfAsset
/// @author Sven Meyer
/// @notice only implements very basic functionality (add, retrieve)
/// @dev functions passing structs can be tested using the experimental ABIEncoderV2

// Import Ownable from the OpenZeppelin Contracts library
// append 'onlyOwner' to control access to function
// import "@openzeppelin/contracts/ownership/Ownable.sol";
// contract ProofOfAsset is Ownable {

contract ProofOfAssetMint {

	address public owner;
	// address public tokenContractAddress;
	FECoin  public tokenContract;

	constructor() public {
		owner = msg.sender;
	}

	function setTokenContractAddress(address _tokenContractAddress) public {  // add onlyOwner TODO
		// tokenContractAddress = _tokenContractAddress;  // redundant - remove later : TODO
		tokenContract = FECoin(_tokenContractAddress);
	}

	// set / get price for a registration transaction

	uint private price;  // we may want to do some internal price calculations in the future

	function setPrice(uint new_price) public {  // add onlyOwner TODO
		price = new_price;
	}

	function getPrice() public view returns (uint) {
		return price;
	}

	// ----------------------------------------------------------------------------

	// error codes library
	int constant code_item_not_found     = -1;
	int constant code_not_authorized     = -2;
	int constant code_invalid_params     = -3;
	int constant code_already_registered = -4;
	int constant code_amount_wrong       = -5;
	int constant code_insufficient_funds = -6;


	/// @dev data struct to store one ProofOfAsset item / RegData
	struct Item {
		uint     id;               // index of item starting with 0
		uint     blockTimestamp;   // timestamp of registration
		uint     productAmount;    // amount of product (18 decimal digits fractional part) > ufixed TODO?
		uint     mintAmount;       // number of token minted for this registration > ufixed TODO?
		address  tokenContractAddress;    // address of token to mint
		address  registrar;        // registrar of item
		string   fileHash;         // hash of file (= IPFS storage location)
		// string   tokenMintTx;      // token mint transaction
		string   productName;      // name of product
		string   metadata;         // (optional) additional metadata, JSON format recommended)
	}

	uint itemCount = 0; // private - we do not want direct access to it

	function getNumberofItems() public view returns (uint) {
		return itemCount;
	}

	/// @dev mapping from id to one item
	mapping (uint => Item) public items;

	/// @dev mapping from hash to item
	mapping (string => Item) public itemByHash;

	/// @dev mapping from registrar address to array of items
	mapping (address => Item[]) public itemsOfRegistrar;


	/// @dev event to notify of result of addItem function
	/// @return if >= 0 itemID
	/// @return if <  0 errorCode
	event eventAddItem(
		int indexed itemID // or errorCode
	);


	/// @dev add a new item to the collection
	/// @dev emits eventAddItem event

	function addItem(
			string memory _fileHash,
	    uint   _productAmount,
			string memory _productName,
      uint    _mintAmount,
      string memory _metadata)
      public
	{
		// check if any parameter is too long / out of scope

		// check if item does not already exist
    require(itemByHash[_fileHash].registrar == address(0), "item hash is already registered");

    // TODO implement payable contract
		// require(msg.value (uint) == price, "amount sent does not match price");  // number of wei sent with the message

    // check if a token contract has been set
		require(address(tokenContract) != address(0), 'No token contract defined');

		bool tokenMintResult = tokenContract.mint(tx.origin, _mintAmount);

		require(tokenMintResult, "Token mint process failed");

		Item memory item = Item({
			id              : itemCount,
			registrar       : msg.sender,  // tx.origin ? https://solidity.readthedocs.io/en/v0.5.3/security-considerations.html#tx-origin
			blockTimestamp  : block.timestamp,  // do we actually have to store that explicitly? TODO?
			productName     : _productName,
			productAmount   : _productAmount,
			tokenContractAddress : address(tokenContract), // tokenContract.address, .this (current contract’s type): the current contract, explicitly convertible to address // TODO
			mintAmount      : _mintAmount,
			fileHash        : _fileHash,
			// tokenMintTx     : tokenMintResult,
			metadata        : _metadata
		});

	    // add new item to mapping : hash -> item
		itemByHash[_fileHash] = item;

		// add new item to mapping : id -> item
		items[itemCount++] = item;

		// add new item to registrar.array[] > item
		itemsOfRegistrar[msg.sender].push(item);

		emit eventAddItem(int(itemCount - 1));
	}


	/// @dev retrieve item by index from collection
	/// @param index (starting with 0) of item within items
	/// @return url URL to the media file (image or video)
	/// @return caption Caption text for media item
	/// @dev Item struct will be decomposed and the elements will be returned individually
    /*
	function getItemByIndex(uint index) public view returns (string memory, string memory) {
		require(index < itemCount, "ERROR: index out of bounds:");
		return(items[index].url, items[index].caption);
	}
    */

	/// @dev retrive item  by index as struct from collection
	/// @param index (starting with 0) of item within items
	/// @return Item struct
	/// @dev emits ItemAdded event
	/// @dev Passing structs is only supported in the new experimental ABI encoder - use with care!
	function getItemStructByIndex(uint index) public view returns (Item memory) {
		require(index < itemCount, "ERROR: index out of bounds:");
		return(items[index]);
	}

	function getItemStructByHash(string memory _fileHash) public view returns (Item memory) {
		return(itemByHash[_fileHash]);
	}

	function getNumberOfItems(address _registrar) public view returns (uint) {
		// TODO : check for existnece before trying to access length
		return(itemsOfRegistrar[_registrar].length);
	}

	function getItembyIndex(address _registrar, uint _index) public view returns (Item memory) {
		// TODO : check for existnece before trying to access length
		return(itemsOfRegistrar[_registrar][_index]);
	}

}
