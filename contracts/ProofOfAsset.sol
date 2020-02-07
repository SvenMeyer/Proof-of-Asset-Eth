pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;   // required to pass structs as function parameter and return values

/// @title  ProofOfAsset
/// @author Sven Meyer
/// @notice only implements very basic functionality (add, retrieve)
/// @dev functions passing structs can be tested using the experimental ABIEncoderV2

contract ProofOfAsset {

	address public owner;

	constructor() public {
		owner = msg.sender;
	}

	// set / get price for a registration transaction

	uint private price;

	function setPrice(uint x) public {
		price = x;
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
		uint     mintAmount;       // number of token minted for this registration
		address  tokenContract;    // address of token to mint
		address  registrar;        // registrar of item
		string   fileHash;         // hash of file (= IPFS storage location)
		string   adrCloudStorage;  // backup / 2nd cloud storage location
		string   metadata;         // (optional) additional metadata
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

	function addItem(string memory _fileHash,
                     string memory _adrCloudStorage,
                     string memory _metadata,
					 address _tokenContract,
                     uint    _mintAmount)
                     public {
		// if parameter not too long
		// if item does not already exist
		// if payment >= (price * mint_amount)
		Item memory item = Item({
			id              : itemCount,
			registrar       : msg.sender,  // tx.origin ? https://solidity.readthedocs.io/en/v0.5.3/security-considerations.html#tx-origin
			blockTimestamp  : block.timestamp,
			tokenContract   : _tokenContract,
			mintAmount      : _mintAmount,
			fileHash        : _fileHash,
			adrCloudStorage : _adrCloudStorage,
			metadata        : _metadata
		});
		items[itemCount] = item;
		itemCount++;
		// add to registrar > item mapping
		itemsOfRegistrar[msg.sender].push(item);
		// add to hash > item mapping
		itemByHash[_fileHash] = item;
		// mint token
		// _tokenContract.mint(_mintAmount, msg.sender);  // TODO
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
