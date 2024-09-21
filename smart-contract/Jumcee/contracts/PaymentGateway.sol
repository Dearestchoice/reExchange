// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentGateway is Ownable, ReentrancyGuard {
    // State variables
    AggregatorV3Interface internal priceFeed;
    address public merchant;
    uint256 public feePercentage; // In basis points, e.g., 100 = 1%
    
    // Events
    event PaymentReceived(address indexed payer, address token, uint256 amount, uint256 fiatValue);
    event PaymentLinkGenerated(address indexed merchant, string paymentLink, uint256 amount, string currency);

    // Constructor: set the Chainlink price feed, merchant address, and fee percentage
    constructor(address _priceFeed, address _merchant, uint256 _feePercentage) Ownable(_merchant) {
        priceFeed = AggregatorV3Interface(_priceFeed);
        merchant = _merchant;
        feePercentage = _feePercentage;
    }

    // Public function to receive payments in ERC20 tokens (USDT, USDC)
    function payWithToken(address token, uint256 tokenAmount) external nonReentrant {
        require(tokenAmount > 0, "Amount must be greater than 0");

        // Transfer token from customer to this contract
        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);

        // Calculate fiat value of the token amount using Chainlink price feed
        uint256 fiatValue = getFiatEquivalent(tokenAmount);

        // Emit event for payment received
        emit PaymentReceived(msg.sender, token, tokenAmount, fiatValue);

        // Transfer tokens to the merchant after deducting fees
        uint256 fee = (tokenAmount * feePercentage) / 10000; // Fee in basis points
        uint256 amountAfterFee = tokenAmount - fee;

        IERC20(token).transfer(merchant, amountAfterFee);
    }

    // Function to fetch real-time price data using Chainlink (for fiat conversion)
    function getFiatEquivalent(uint256 cryptoAmount) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price");

        uint256 fiatValue = (cryptoAmount * uint256(price)) / 1e18; // Assuming price is returned with 18 decimals
        return fiatValue;
    }

    // Function to generate a payment link for a specific amount and currency
    function generatePaymentLink(uint256 amount, string calldata currency) external onlyOwner returns (string memory) {
        string memory paymentLink = string(abi.encodePacked("https://paywithcrypto.com/link?merchant=", toAsciiString(merchant), "&amount=", uint2str(amount), "&currency=", currency));
        
        emit PaymentLinkGenerated(merchant, paymentLink, amount, currency);
        return paymentLink;
    }

    // Function to change the fee percentage (only owner)
    function setFeePercentage(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        feePercentage = newFeePercentage;
    }

    // Utility function to convert address to string
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2 ** (8 * (19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2 * i] = char(hi);
            s[2 * i + 1] = char(lo);
        }
        return string(s);
    }

    // Helper function for `toAsciiString`
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    // Utility function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
