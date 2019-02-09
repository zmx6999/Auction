pragma solidity ^0.4.24;

contract Escrow {
    address buyer;
    address seller;
    address arbiter;

    uint buyerVoteCount;
    uint sellerVoteCount;

    mapping(address=>bool) voted;
    bool over;

    constructor(address _buyer,address _seller,address _arbiter) payable {
        buyer=_buyer;
        seller=_seller;
        arbiter=_arbiter;
    }

    modifier canVote(address voter) {
        require(!over);
        require(voter==buyer || voter==seller || voter==arbiter);
        require(!voted[voter]);
        _;
    }

    function voteForBuyer(address voter) public canVote(voter) {
        buyerVoteCount+=1;
        voted[voter]=true;
        if(buyerVoteCount>=2) {
            buyer.transfer(address(this).balance);
            over=true;
        }
    }

    function voteForSeller(address voter) public canVote(voter) {
        sellerVoteCount+=1;
        voted[voter]=true;
        if(sellerVoteCount>=2) {
            seller.transfer(address(this).balance);
            over=true;
        }
    }

    function escrowInfo(address voter) public view returns (address,address,address,uint,uint,bool,bool) {
        return (buyer,seller,arbiter,buyerVoteCount,sellerVoteCount,voted[voter],over);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
