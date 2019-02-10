pragma solidity ^0.4.24;

import "./Escrow.sol";

contract ECommerce {
    struct Goods {
        uint id;
        string name;
        string category;
        string imageLink;
        string introLink;

        GoodsStatus status;
        GoodsCondition condition;

        uint startPrice;
        uint auctionStartTime;
        uint auctionEndTime;
        uint highestBid;
        uint secondHighestBid;
        address highestBidder;
        uint totalBidder;

        mapping(address=>mapping(bytes32=>Bid)) bidList;
    }

    enum GoodsStatus {Open,Sold,Unsold}
    enum GoodsCondition {New,Used}

    uint public totalGoods;
    mapping(uint=>Goods) goodsList;
    mapping(uint=>address) goodsShop;
    mapping(uint=>address) goodsEscrow;

    struct Bid {
        address bidder;
        bool revealed;
        uint actualPrice;
    }

    function addGoods(string name,string category,string imageLink,string introLink,uint condition,uint startPrice,uint auctionStartTime,uint auctionEndTime) public {
        totalGoods+=1;
        goodsList[totalGoods]=Goods({id:totalGoods,name:name,category:category,imageLink:imageLink,introLink:introLink,status:GoodsStatus.Open,condition:GoodsCondition(condition),startPrice:startPrice,auctionStartTime:auctionStartTime,auctionEndTime:auctionEndTime,highestBid:0,secondHighestBid:0,highestBidder:0,totalBidder:0});
        goodsShop[totalGoods]=msg.sender;
    }

    function getGoods(uint goodsId) public view returns (uint,string,string,string,string,uint,uint,uint,uint,uint) {
        Goods memory goods=goodsList[goodsId];
        return (goods.id,goods.name,goods.category,goods.imageLink,goods.introLink,uint(goods.status),uint(goods.condition),goods.startPrice,goods.auctionStartTime,goods.auctionEndTime);
    }

    function bid(uint goodsId,uint idealPrice,string secret) payable public {
        require(msg.sender!=goodsShop[goodsId]);
        Goods storage goods=goodsList[goodsId];
        require(goods.auctionStartTime<=now && now<=goods.auctionEndTime);
        require(idealPrice>=goods.startPrice);
        bytes32 hash=keccak256(abi.encodePacked(idealPrice,secret));
        require(goods.bidList[msg.sender][hash].bidder==0);
        goods.totalBidder+=1;
        goods.bidList[msg.sender][hash]=Bid({bidder:msg.sender,revealed:false,actualPrice:msg.value});
    }

    function revealBid(uint goodsId,uint idealPrice,string secret) public {
        Goods storage goods=goodsList[goodsId];
        require(now>goods.auctionEndTime);
        bytes32 hash=keccak256(abi.encodePacked(idealPrice,secret));
        Bid storage bid=goods.bidList[msg.sender][hash];
        require(bid.bidder>0);
        require(!bid.revealed);
        uint refund=0;
        if(idealPrice>bid.actualPrice) {
            refund=bid.actualPrice;
        } else if(idealPrice>goods.highestBid) {
            if(goods.highestBidder==0) {
                goods.highestBid=idealPrice;
                goods.secondHighestBid=goods.startPrice;
                goods.highestBidder=msg.sender;
                refund=bid.actualPrice-idealPrice;
            } else {
                goods.highestBidder.transfer(goods.highestBid);
                goods.secondHighestBid=goods.highestBid;
                goods.highestBid=idealPrice;
                goods.highestBidder=msg.sender;
                refund=bid.actualPrice-idealPrice;
            }
        } else if(idealPrice>goods.secondHighestBid) {
            goods.secondHighestBid=idealPrice;
            refund=bid.actualPrice;
        } else {
            refund=bid.actualPrice;
        }
        bid.revealed=true;
        if(refund>0) msg.sender.transfer(refund);
    }

    function bidInfo(uint goodsId) public view returns (uint,uint,address,uint) {
        Goods memory goods=goodsList[goodsId];
        return (goods.highestBid,goods.secondHighestBid,goods.highestBidder,goods.totalBidder);
    }

    function finalizeAuction(uint goodsId) public {
        Goods storage goods=goodsList[goodsId];
        require(now>goods.auctionEndTime);
        require(msg.sender!=goodsShop[goodsId]);
        require(msg.sender!=goods.highestBidder);
        require(goods.status==GoodsStatus.Open);
        if(goods.totalBidder==0) {
            goods.status=GoodsStatus.Unsold;
        } else {
            uint refund=goods.highestBid-goods.secondHighestBid;
            if(refund>0) goods.highestBidder.transfer(refund);
            Escrow escrow=(new Escrow).value(goods.secondHighestBid)(goods.highestBidder,goodsShop[goodsId],msg.sender);
            goodsEscrow[goodsId]=address(escrow);
            goods.status=GoodsStatus.Sold;
        }
    }

    function voteForBuyer(uint goodsId) public {
        Escrow(goodsEscrow[goodsId]).voteForBuyer(msg.sender);
    }

    function voteForSeller(uint goodsId) public {
        Escrow(goodsEscrow[goodsId]).voteForSeller(msg.sender);
    }

    function escrowInfo(uint goodsId) public view returns (address,address,address,uint,uint,bool,bool) {
        return Escrow(goodsEscrow[goodsId]).escrowInfo(msg.sender);
    }

    function escrowBalance(uint goodsId) public view returns (uint) {
        return Escrow(goodsEscrow[goodsId]).getBalance();
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
