pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";

contract FECoin is ERC20, ERC20Detailed, ERC20Mintable, ERC20Burnable {
    uint8   public constant DECIMALS = 18;
    uint256 public constant INITIAL_SUPPLY = 0 * (10 ** uint256(DECIMALS));

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */

    constructor () public ERC20Detailed("FECoin-Type1", "FEC1", DECIMALS) {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

}