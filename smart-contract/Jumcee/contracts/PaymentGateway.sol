// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ReactivePaymentGateway is Ownable, ReentrancyGuard, AutomationCompatibleInterface {
    // State variables
    struct TokenInfo {
        AggregatorV3Interface priceFeed;
        uint256 feePercentage; // In basis points, e.g., 100 = 1%
        uint256 lastFeeUpdateTime;
    }
    
    mapping(address => TokenInfo) public supportedTokens;
    address[] public tokenList;
    address public merchant;
    uint256 public feeUpdateInterval; // Time interval for fee updates
    
    // Mapping to track payment confirmations
    mapping(bytes32 => bool) public paymentConfirmed;
    
    // Events
    event PaymentReceived(address indexed payer, address token, uint256 amount, uint256 fiatValue);
    event PaymentLinkGenerated(address indexed merchant, string paymentLink, uint256 amount, string currency);
    event FeePercentageUpdated(address token, uint256 newFeePercentage);
    event PaymentConfirmed(bytes32 indexed paymentId);
    event MissedPaymentNotification(address indexed payer, uint256 amountDue, string reason);
    event TokenAdded(address token, address priceFeed);

    constructor(
        address _merchant,
        uint256 _feeUpdateInterval
    ) Ownable(_merchant) {
        merchant = _merchant;
        feeUpdateInterval = _feeUpdateInterval;
    }

    // Function to add support for a new token
    function addSupportedToken(address token, address priceFeed, uint256 initialFeePercentage) external onlyOwner {
        require(supportedTokens[token].priceFeed == AggregatorV3Interface(address(0)), "Token already supported");
        supportedTokens[token] = TokenInfo({
            priceFeed: AggregatorV3Interface(priceFeed),
            feePercentage: initialFeePercentage,
            lastFeeUpdateTime: block.timestamp
        });
        tokenList.push(token);
        emit TokenAdded(token, priceFeed);
    }

    // Function to receive payments in multiple ERC20 tokens
    function payWithToken(address token, uint256 tokenAmount) external nonReentrant {
        require(tokenAmount > 0, "Amount must be greater than 0");
        require(supportedTokens[token].priceFeed != AggregatorV3Interface(address(0)), "Token not supported");

        // Transfer token from customer to this contract
        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);

        // Calculate fiat value of the token amount using Chainlink price feed
        uint256 fiatValue = getFiatEquivalent(token, tokenAmount);

        // Emit event for payment received
        emit PaymentReceived(msg.sender, token, tokenAmount, fiatValue);

        // Transfer tokens to the merchant after deducting fees
        uint256 fee = (tokenAmount * supportedTokens[token].feePercentage) / 10000; // Fee in basis points
        uint256 amountAfterFee = tokenAmount - fee;

        IERC20(token).transfer(merchant, amountAfterFee);
    }

    // Function to fetch real-time price data for multiple tokens
    function getFiatEquivalent(address token, uint256 cryptoAmount) public view returns (uint256) {
        TokenInfo storage tokenInfo = supportedTokens[token];
        require(address(tokenInfo.priceFeed) != address(0), "Token not supported");

        (, int256 price, , , ) = tokenInfo.priceFeed.latestRoundData();
        require(price > 0, "Invalid price");

        uint256 fiatValue = (cryptoAmount * uint256(price)) / 1e18; // Assuming price is returned with 18 decimals
        return fiatValue;
    }

    // Function to generate a payment link for a specific amount and currency
    function generatePaymentLink(uint256 amount, string calldata currency) external view returns (string memory) {
        string memory paymentLink = string(abi.encodePacked(
            "https://paywithcrypto.com/link?merchant=", 
            toAsciiString(merchant), 
            "&amount=", uint2str(amount), 
            "&currency=", currency
        ));
        
        return paymentLink;
    }

    // Function to change the fee percentage for a specific token
    function setFeePercentage(address token, uint256 newFeePercentage) external onlyOwner {
        require(supportedTokens[token].priceFeed != AggregatorV3Interface(address(0)), "Token not supported");
        require(newFeePercentage <= 1000, "Fee cannot exceed 10%");
        supportedTokens[token].feePercentage = newFeePercentage;
        emit FeePercentageUpdated(token, newFeePercentage);
    }

    // Chainlink Keepers functions
    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData) {
        for (uint i = 0; i < tokenList.length; i++) {
            address token = tokenList[i];
            if (block.timestamp - supportedTokens[token].lastFeeUpdateTime > feeUpdateInterval) {
                return (true, abi.encode(token));
            }
        }
        return (false, bytes(""));
    }

    function performUpkeep(bytes calldata performData) external override {
        address token = abi.decode(performData, (address));
        TokenInfo storage tokenInfo = supportedTokens[token];
        
        if (block.timestamp - tokenInfo.lastFeeUpdateTime > feeUpdateInterval) {
            // Get the current market price
            (, int256 price, , , ) = tokenInfo.priceFeed.latestRoundData();
            
            // Example dynamic fee adjustment logic (customize as needed)
            if (price > 0) {
                uint256 newFeePercentage = calculateDynamicFee(uint256(price));
                tokenInfo.feePercentage = newFeePercentage;
                tokenInfo.lastFeeUpdateTime = block.timestamp;
                emit FeePercentageUpdated(token, newFeePercentage);
            }
        }
    }

    // Helper function to calculate dynamic fee based on market conditions
    function calculateDynamicFee(uint256 currentPrice) internal pure returns (uint256) {
        // Example logic: Lower fee for higher prices, higher fee for lower prices
        // Adjust this logic based on your specific requirements
        if (currentPrice > 1e8) { // Assuming price is in 8 decimal places
            return 50; // 0.5% fee for high prices
        } else if (currentPrice > 5e7) {
            return 75; // 0.75% fee for medium prices
        } else {
            return 100; // 1% fee for low prices
        }
    }

    // Callback function for off-chain services
    function callback(bytes32 paymentId, bool confirmed) external onlyOwner {
        require(!paymentConfirmed[paymentId], "Payment already confirmed");
        paymentConfirmed[paymentId] = confirmed;
        emit PaymentConfirmed(paymentId);
    }

    // Missed payments or underpayment notifications
    function notifyMissedPayment(address payer, uint256 amountDue, string memory reason) external onlyOwner {
        emit MissedPaymentNotification(payer, amountDue, reason);
    }

    // Utility function to convert address to string
    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint256(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);
        }
        return string(s);
    }

    // Helper function for `toAsciiString`
    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);
    }

    // Utility function to convert uint to string
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}