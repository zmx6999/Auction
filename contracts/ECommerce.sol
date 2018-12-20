pragma solidity ^0.4.24;
import "./Escrow.sol";

contract ECommerce {
    struct Goods {
        uint id;
        string name;
        string category;
        string imageLink;
        string descLink;

        GoodsStatus status;
        GoodsCondition condition;

        uint startPrice;
        uint auctionStartTime;
        uint auctionEndTime;

        uint highestBid;
        uint secondHighestBid;
        address highestBidder;
        uint totalBids;

        mapping(address=>mapping(bytes32=>Bid)) bidList;
    }

    enum GoodsStatus {Open,Sold,Unsold}
    enum GoodsCondition {New,Used}

    mapping(uint=>Goods) goodsList;
    mapping(uint=>address) public goodsShop;
    uint public totalGoods;

    struct Bid {
        address bidder;
        uint goodsId;
        uint sendPrice;
        bool revealed;
    }

    mapping(uint=>address) public goodsEscrow;

    function addGoods(string name,string category,string imageLink,string descLink,uint condition,uint startPrice,uint auctionStartTime,uint auctionEndTime) public {
        totalGoods++;
        goodsList[totalGoods]=Goods({id:totalGoods,name:name,category:category,imageLink:imageLink,descLink:descLink,status:GoodsStatus.Open,condition:GoodsCondition(condition),startPrice:startPrice,auctionStartTime:auctionStartTime,auctionEndTime:auctionEndTime,highestBid:0,secondHighestBid:0,highestBidder:0,totalBids:0});
        goodsShop[totalGoods]=msg.sender;
    }

    function goodsInfo(uint goodsId) public view returns (uint,string,string,string,string,uint,uint,uint,uint,uint) {
        Goods memory goods=goodsList[goodsId];
        return (goods.id,goods.name,goods.category,goods.imageLink,goods.descLink,uint(goods.status),uint(goods.condition),goods.startPrice,goods.auctionStartTime,goods.auctionEndTime);
    }

    function bid(uint goodsId,uint idealPrice,string secret) payable public {
        require(msg.sender!=goodsShop[goodsId]);
        Goods goods=goodsList[goodsId];
        require(now>=goods.auctionStartTime && now<=goods.auctionEndTime);
        require(idealPrice>=goods.startPrice);
        bytes32 hash=keccak256(abi.encodePacked(idealPrice,secret));
        require(goods.bidList[msg.sender][hash].bidder==0);
        goods.totalBids++;
        goods.bidList[msg.sender][hash]=Bid({bidder:msg.sender,goodsId:goodsId,sendPrice:msg.value,revealed:false});
    }

    function revealBid(uint goodsId,uint idealPrice,string secret) public {
        Goods goods=goodsList[goodsId];
        require(now>goods.auctionEndTime);
        bytes32 hash=keccak256(abi.encodePacked(idealPrice,secret));
        Bid bid=goods.bidList[msg.sender][hash];
        require(bid.bidder>0);
        require(!bid.revealed);
        uint refund=0;
        if(idealPrice>bid.sendPrice) {
            refund=bid.sendPrice;
        } else if(idealPrice>goods.highestBid) {
            if(goods.highestBidder==0) {
                goods.highestBid=idealPrice;
                goods.secondHighestBid=goods.startPrice;
                goods.highestBidder=msg.sender;
                refund=bid.sendPrice-idealPrice;
            } else {
                goods.highestBidder.transfer(goods.highestBid);
                goods.secondHighestBid=goods.highestBid;
                goods.highestBid=idealPrice;
                goods.highestBidder=msg.sender;
                refund=bid.sendPrice-idealPrice;
            }
        } else if(idealPrice>goods.secondHighestBid) {
            goods.secondHighestBid=idealPrice;
            refund=bid.sendPrice;
        } else {
            refund=bid.sendPrice;
        }
        if(refund>0) msg.sender.transfer(refund);
        bid.revealed=true;
    }

    function bidInfo(uint goodsId) public view returns (uint,uint,address,uint) {
        Goods memory goods=goodsList[goodsId];
        return (goods.highestBid,goods.secondHighestBid,goods.highestBidder,goods.totalBids);
    }

    function finalizeAuction(uint goodsId) public {
        Goods goods=goodsList[goodsId];
        require(now>goods.auctionEndTime);
        require(goods.status==GoodsStatus.Open);
        address buyer=goods.highestBidder;
        address seller=goodsShop[goodsId];
        address arbiter=msg.sender;
        require(buyer!=arbiter && seller!=arbiter);
        if(goods.totalBids==0) {
            goods.status=GoodsStatus.Unsold;
        } else {
            Escrow escrow=(new Escrow).value(goods.secondHighestBid)(buyer,seller,arbiter);
            goodsEscrow[goodsId]=address(escrow);
            uint refund=goods.highestBid-goods.secondHighestBid;
            if(refund>0) buyer.transfer(refund);
            goods.status=GoodsStatus.Sold;
        }
    }

    function voteBuyer(uint goodsId) public {
        Escrow(goodsEscrow[goodsId]).voteBuyer(msg.sender);
    }

    function voteSeller(uint goodsId) public {
        Escrow(goodsEscrow[goodsId]).voteSeller(msg.sender);
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
