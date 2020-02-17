pragma solidity ^0.5.0;

// https://forum.openzeppelin.com/t/importing-openzeppelin-contracts-in-remix/1420

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/math/SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/token/ERC20/ERC20Detailed.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/token/ERC20/ERC20Mintable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/token/ERC20/ERC20Burnable.sol";

contract SimpleToken is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {
    
    uint8   public constant DECIMALS = 6;
    uint256 public constant INITIAL_SUPPLY = 0 * (10 ** uint256(DECIMALS));

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor () public ERC20Detailed("Iron Ore Coin Type1", "FEC1", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
}
