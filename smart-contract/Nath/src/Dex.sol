// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract DEX {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint public totalLiquidityA;
    uint public totalLiquidityB;

    mapping(address => uint) public liquidityA;
    mapping(address => uint) public liquidityB;

    // New function to get the exchange rate of TokenA in terms of TokenB
    function getExchangeRateAB() public view returns (uint) {
        require(totalLiquidityA > 0, "No liquidity for TokenA");
        require(totalLiquidityB > 0, "No liquidity for TokenB");
        return (totalLiquidityB * 1e18) / totalLiquidityA; // Return rate with precision
    }

    // New function to get the exchange rate of TokenB in terms of TokenA
    function getExchangeRateBA() public view returns (uint) {
        require(totalLiquidityB > 0, "No liquidity for TokenB");
        require(totalLiquidityA > 0, "No liquidity for TokenA");
        return (totalLiquidityA * 1e18) / totalLiquidityB; // Return rate with precision
    }

    event LiquidityAdded(address indexed provider, uint amountA, uint amountB);
    event LiquidityRemoved(
        address indexed provider,
        uint amountA,
        uint amountB
    );
    event TokensSwapped(address indexed trader, uint amountIn, uint amountOut);

    event ExchangeRateUpdated(
        uint256 rateAB, // rate of TokenA in terms of TokenB
        uint256 rateBA // rate of TokenB in terms of TokenA
    );

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint amountA, uint amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");

        // Transfer tokens from user to contract
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        totalLiquidityA += amountA;
        totalLiquidityB += amountB;

        liquidityA[msg.sender] += amountA;
        liquidityB[msg.sender] += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
        emit ExchangeRateUpdated(getExchangeRateAB(), getExchangeRateBA());
    }

    function removeLiquidity(uint amountA, uint amountB) external {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than 0");
        require(
            liquidityA[msg.sender] >= amountA &&
                liquidityB[msg.sender] >= amountB,
            "Insufficient liquidity"
        );

        totalLiquidityA -= amountA;
        totalLiquidityB -= amountB;

        liquidityA[msg.sender] -= amountA;
        liquidityB[msg.sender] -= amountB;

        // Transfer tokens back to the user
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    function swap(uint amountIn, address fromToken) external {
        require(amountIn > 0, "Amount must be greater than 0");
        require(
            fromToken == address(tokenA) || fromToken == address(tokenB),
            "Invalid token"
        );

        uint amountOut;
        if (fromToken == address(tokenA)) {
            require(
                tokenA.transferFrom(msg.sender, address(this), amountIn),
                "Transfer failed"
            );
            amountOut = getAmountOut(
                amountIn,
                totalLiquidityA,
                totalLiquidityB
            );
            require(
                tokenB.balanceOf(address(this)) >= amountOut,
                "Insufficient liquidity"
            );
            tokenB.transfer(msg.sender, amountOut);
            totalLiquidityA += amountIn;
            totalLiquidityB -= amountOut;
        } else {
            require(
                tokenB.transferFrom(msg.sender, address(this), amountIn),
                "Transfer failed"
            );
            amountOut = getAmountOut(
                amountIn,
                totalLiquidityB,
                totalLiquidityA
            );
            require(
                tokenA.balanceOf(address(this)) >= amountOut,
                "Insufficient liquidity"
            );
            tokenA.transfer(msg.sender, amountOut);
            totalLiquidityB += amountIn;
            totalLiquidityA -= amountOut;
        }

        emit TokensSwapped(msg.sender, amountIn, amountOut);
    }

    function getAmountOut(
        uint amountIn,
        uint reserveIn,
        uint reserveOut
    ) public pure returns (uint) {
        require(amountIn > 0, "AmountIn must be greater than 0");
        require(reserveIn > 0 && reserveOut > 0, "Invalid reserves");

        uint amountInWithFee = amountIn * (997); // Assuming a 0.3% fee
        uint numerator = amountInWithFee * (reserveOut);
        uint denominator = reserveIn * (1000) + (amountInWithFee);
        return numerator / denominator;
    }
}
