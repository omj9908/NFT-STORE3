// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * 🔴 Red Dice (ERC-20 토큰)
 */
contract RedDiceToken is ERC20, Ownable {
    event MintRedDice(address indexed recipient, uint256 amount);

    constructor() ERC20("Red Dice", "RED") Ownable() {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mintRedDice(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");

        _mint(to, amount);
        emit MintRedDice(to, amount);
    }

    // ✅ [수정] owner()가 아니라 getOwner()를 추가해야 외부에서 호출 가능
    function getOwner() external view returns (address) {
        return owner();
    }
}

contract BlueDiceToken is ERC20, Ownable {
    event MintBlueDice(address indexed recipient, uint256 amount);

    constructor() ERC20("Blue Dice", "BLUE") Ownable() {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function mintBlueDice(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");

        _mint(to, amount);
        emit MintBlueDice(to, amount);
    }

    function getOwner() external view returns (address) {
        return owner();
    }
}