// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DEX} from "../src/Dex.sol";

contract DexScript is Script {
    DEX public dex;

    address public USDT = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
    address public XRP = 0x628F76eAB0C1298F7a24d337bBbF1ef8A1Ea6A24;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        dex = new DEX(USDT, XRP);

        vm.stopBroadcast();
    }
}
