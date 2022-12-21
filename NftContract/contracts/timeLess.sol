// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TimeLess is ERC721 {
    // CONTRACT ADDRESS:
    // 0x364e4F9582665c6BA551968dE199387D24fbfd4D
    // https://goerli.etherscan.io/address/0x364e4F9582665c6BA551968dE199387D24fbfd4D#code

    receive() external payable {}

    event Bid(address indexed _highestBidder, uint8 _highestBid);

    address payable public owner;

    uint32 public startAt;
    uint32 public endAt;
    uint64 public startingBid = 0.005 ether;

    struct Bids {
        uint8 nftId;
        uint32 time;
        address Bidder;
        uint256 Bid;
    }

    mapping(address => uint256) public bidsStore;

    Bids[] public bid;

    uint256 public currentHighestBid;
    address public currentHighestBidder;

    uint32 public currentTime;
    uint8 public currentWeek;

    bool public startedSec;
    bool public started;

    constructor() ERC721("TimeLess", "TimeLess") {
        startedSec = true;
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function start() external onlyOwner{
        require(!started, "started");
        started = true;

        startAt = uint32(block.timestamp);
        currentTime = uint32(block.timestamp + 7 days);
        endAt = uint32(startAt + 90 days);
    }

    function bidNft() external payable {
        require(startedSec, "Not Started");
        require(block.timestamp < currentTime, "Bid Period Ended");
        require(msg.value > startingBid, "Bid Is Under-UnderValue :)");
        require(msg.value > currentHighestBid, "Bid Is UnderValue");
        require(msg.sender != address(0), "Zero Address");
        require(currentWeek < 12, "Auction Ended");

        bid.push(
            Bids({
                nftId: currentWeek,
                time: uint32(block.timestamp),
                Bidder: msg.sender,
                Bid: msg.value
            })
        );

        currentHighestBid = msg.value;
        currentHighestBidder = msg.sender;

        bidsStore[msg.sender] = msg.value;
    }

    /**
     * @dev Pause contract as measure of security
     */
    function pause() external onlyOwner {
        startedSec = !startedSec;
    }

    /**
     * @dev non-highestbidders to withdraw bid
     */
    function withdrawBid() public {
        require(startedSec, "Not Started");
        require(
            msg.sender != currentHighestBidder,
            "HighestBidder Cannot Withdraw"
        );
        uint256 bidAmount = bidsStore[msg.sender];
        bidsStore[msg.sender] = 0;

        payable(msg.sender).transfer(bidAmount);
    }

    /**
     * @dev Reset time variables everytime there is a mint
     */
    function reset() private {
        currentTime = uint32(block.timestamp + 7 days);
        currentWeek++;
        currentHighestBid = 0;
        currentHighestBidder = address(0);
    }

    /**
     * @dev mint NFT to the highestbidder after bid is over
     */
    function mintToHighestBidder() external {
        require(startedSec, "Not Started");
        require(block.timestamp >= currentTime, "Auction Not Ended");
        require(currentWeek < 12, "Auction Ended");
        require(currentHighestBidder != address(0), "Can't Mint To 0 Address");

        owner.transfer(currentHighestBid);

        _mint(currentHighestBidder, currentWeek);
        reset();
    }

    /**
     * @dev
     * can only be called after auction has ended
     */
    function withdraw() external onlyOwner {
        require(block.timestamp > endAt, "Auction Not Ended");
        uint256 balance = address(this).balance;
        owner.transfer(balance);
    }

}
