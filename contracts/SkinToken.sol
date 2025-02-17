// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * 🔥 ERC-20 주사위 토큰 (공통 부모 컨트랙트)
 */
contract DiceToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    event MintDice(address indexed recipient, uint256 amount);

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender); // 배포자에게 ADMIN 권한 부여
        _setupRole(MINTER_ROLE, msg.sender); // 배포자에게 MINTER_ROLE 부여
        _mint(msg.sender, 10000 * 10 ** decimals()); // 초기 공급량
    }

    function mintDice(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be greater than 0");

        _mint(to, amount);
        emit MintDice(to, amount);
    }

    function grantMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MINTER_ROLE, account);
    }

    function revokeMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MINTER_ROLE, account);
    }

    function hasMinterRole(address account) external view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }
}

/**
 * 🔴 Red Dice Token (ERC-20)
 */
contract RedDiceToken is DiceToken {
    constructor() DiceToken("Red Dice", "RED") {}
}

/**
 * 🔵 Blue Dice Token (ERC-20)
 */
contract BlueDiceToken is DiceToken {
    constructor() DiceToken("Blue Dice", "BLUE") {}
}
