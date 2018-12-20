pragma solidity ^0.4.24;

contract Escrow {
    address public buyer;
    address public seller;
    address public arbiter;
    uint public buyerVoteCount;
    uint public sellerVoteCount;
    mapping(address=>bool) public voted;
    bool public over;

    constructor(address _buyer,address _seller,address _arbiter) payable public {
        buyer=_buyer;
        seller=_seller;
        arbiter=_arbiter;
    }

    modifier userRestrict(address user) {
        require(buyer==user || seller==user || arbiter==user);
        _;
    }

    function voteBuyer(address user) public userRestrict(user) {
        require(!over);
        require(!voted[user]);
        buyerVoteCount++;
        voted[user]=true;
        if(buyerVoteCount>=2) {
            buyer.transfer(address(this).balance);
            over=true;
        }
    }

    function voteSeller(address user) public userRestrict(user) {
        require(!over);
        require(!voted[user]);
        sellerVoteCount++;
        voted[user]=true;
        if(sellerVoteCount>=2) {
            seller.transfer(address(this).balance);
            over=true;
        }
    }

    function escrowInfo(address user) public view returns (address,address,address,uint,uint,bool,bool) {
        return (buyer,seller,arbiter,buyerVoteCount,sellerVoteCount,voted[user],over);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
