//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DEX} from "../src/Dex.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract DEXTest is Test {
    MockERC20 private tokenA;
    MockERC20 private tokenB;
    DEX private dex;

    address private user1;
    address private user2;

    function setUp() public {
        tokenA = new MockERC20("Token A", "TKA");
        tokenB = new MockERC20("Token B", "TKB");
        dex = new DEX(address(tokenA), address(tokenB));

        user1 = address(0x123);
        user2 = address(0x456);

        // Mint tokens for testing
        tokenA.mint(user1, 1000 ether);
        tokenA.mint(user2, 1000 ether);
        tokenB.mint(user1, 1000 ether);
        tokenB.mint(user2, 1000 ether);

        // Approve tokens for the DEX contract
        vm.startPrank(user1);
        tokenA.approve(address(dex), 1000 ether);
        tokenB.approve(address(dex), 1000 ether);
        vm.stopPrank();

        vm.startPrank(user2);
        tokenA.approve(address(dex), 1000 ether);
        tokenB.approve(address(dex), 1000 ether);
        vm.stopPrank();
    }

    function testAddLiquidity() public {
        vm.startPrank(user1);

        // Add liquidity
        dex.addLiquidity(100 ether, 200 ether);

        // Check liquidity in the DEX contract
        assertEq(dex.totalLiquidityA(), 100 ether);
        assertEq(dex.totalLiquidityB(), 200 ether);
        assertEq(dex.liquidityA(user1), 100 ether);
        assertEq(dex.liquidityB(user1), 200 ether);

        // Check events
        vm.expectEmit(true, true, true, true);
        emit DEX.LiquidityAdded(user1, 100 ether, 200 ether);
        vm.expectEmit(true, true, true, true);
        emit DEX.ExchangeRateUpdated(
            dex.getExchangeRateAB(),
            dex.getExchangeRateBA()
        );
        dex.addLiquidity(100 ether, 200 ether);

        vm.stopPrank();
    }
}
