// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'
import $ from 'jquery'

const ipfsAPI = require('ipfs-api')
const ipfs = ipfsAPI('127.0.0.1',5001,{protocol:'http'})

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import ECommerceArtifact from '../../build/contracts/ECommerce'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const ECommerce = contract(ECommerceArtifact)
var instance

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts

window.App = {
  start: async function () {
      ECommerce.setProvider(web3.currentProvider)
      instance = await ECommerce.deployed()
      if($('#product-list').length > 0) App.getGoodsList()
      if($('#add-item-to-store').length > 0) {
          var reader
          $('#product-image').change(function (e) {
              if (e.target.files.length == 0) return
              reader = new FileReader()
              reader.readAsArrayBuffer(e.target.files[0])
          })
          $('#add-item-to-store-btn').click(function () {
              var json = JSON.parse('{"'+$('#add-item-to-store').serialize().replace(/"/g,'\\"').replace(/&/g,'","').replace(/=/g,'":"')+'"}')
              var params = {}
              Object.keys(json).forEach(function (k) {
                  params[k] = decodeURIComponent(decodeURI(json[k]))
              })
              App.addGoods(reader,params)
          })
      }
      if ($('#product-details').length > 0) App.getGoodsDetail()
      if ($('#bidding-btn').length > 0) {
          $('#bidding-btn').click(function () {
              App.bid()
          })
      }
      if ($('#revealing-btn').length > 0) {
          $('#revealing-btn').click(function () {
              App.revealBid()
          })
      }
      if ($('#finalize-auction-btn').length > 0) {
          $('#finalize-auction-btn').click(function () {
              App.finalizeAuction()
          })
      }
      if ($('#release-funds').length > 0) {
          $('#release-funds').click(function () {
              App.voteForSeller()
          })
      }
      if ($('#refund-funds').length > 0) {
          $('#refund-funds').click(function () {
              App.voteForBuyer()
          })
      }
  },

  addGoods: async function (reader,params) {
      try {
          params['image-link'] = await App.addImageToIPFS(reader)
          params['intro-link'] = await App.addIntroToIPFS(params['product-description'])
          await instance.addGoods(params['product-name'],params['product-category'],params['image-link'],params['intro-link'],params['product-condition'],web3.toWei(params['product-price'],'ether'),parseInt(Date.parse(params['product-auction-start'])/1000),parseInt(Date.parse(params['product-auction-end'])/1000),{from:web3.eth.accounts[0],gas:3000000})
          window.location.href = 'index.html'
      } catch (e) {
          console.log(e)
      }
  },

  getGoodsList: async function () {
      var totalGoods = await instance.totalGoods()
      var html = ''
      for (var i=1;i<=totalGoods;i++) {
          var goodsInfo = await instance.getGoods(i)
          let {0:id,1:name,2:category,3:imageLink,4:introLink,5:status,6:condition,7:startPrice,8:auctionStartTime,9:auctionEndTime} = goodsInfo
          html += '<div><a href="product.html?id='+id+'">' +
              '<img src="http://127.0.0.1:8080/ipfs/'+imageLink+'" width="200">' +
              '<div>'+name+'</div>' +
              '<div>'+category+'</div>' +
              '<div>Start Price:'+App.displayPrice(startPrice)+'</div>' +
              '<div>Start Time:'+App.displayTime(auctionStartTime)+'</div>' +
              '<div>End Time:'+App.displayTime(auctionEndTime)+'</div>' +
              '</a></div>'
      }
      $('#product-list').html(html)
  },

  getGoodsDetail: async function () {
      var goodsId = new URLSearchParams(window.location.search).get('id')
      var goodsInfo = await instance.getGoods(goodsId)
      let {0:id,1:name,2:category,3:imageLink,4:introLink,5:status,6:condition,7:startPrice,8:auctionStartTime,9:auctionEndTime} = goodsInfo
      $('#product-name').html(name)
      $('#product-price').html(App.displayPrice(startPrice))
      $('#product-auction-end').html(App.displayEnd(auctionEndTime))
      var intro = await ipfs.cat(introLink)
      $('#product-desc').append(intro.toString())
      $('#product-id').val(goodsId)
      $('#product-image').html('<img src="http://127.0.0.1:8080/ipfs/'+imageLink+'" width="480">')
      var bidInfo = await instance.bidInfo(goodsId)
      let {0:highestBid,1:secondHighestBid,2:highestBidder,3:totalBidder} = bidInfo
      $('#product-bids').html(parseInt(totalBidder))
      if (status == 0) {
          var now = parseInt(new Date()/1000)
          if (now <= parseInt(auctionEndTime)) {
              $('#bidding').show()
              $('#revealing').hide()
              $('#finalize-auction').hide()
              $('#escrow-info').hide()
          } else if (now <= parseInt(auctionEndTime)+10) {
              $('#bidding').hide()
              $('#revealing').show()
              $('#finalize-auction').hide()
              $('#escrow-info').hide()
          } else {
              $('#bidding').hide()
              $('#revealing').hide()
              $('#finalize-auction').show()
              $('#escrow-info').hide()
          }
      } else if (status == 1) {
          $('#product-status').html(`<p>产品状态：揭标已结束，最高价：`+App.displayPrice(highestBid)+`, 开始进入仲裁投票阶段!</p>`)
          $('#bidding').hide()
          $('#revealing').hide()
          $('#finalize-auction').hide()
          $('#escrow-info').show()
          var escrowInfo = await instance.escrowInfo(goodsId)
          let {0:buyer,1:seller,2:arbiter,3:buyerVoteCount,4:sellerVoteCount,5:voted,6:over} = escrowInfo
          $('#buyer').html(buyer)
          $('#seller').html(seller)
          $('#arbiter').html(arbiter)
          if (buyerVoteCount > 1) {
              $('#release-funds').hide()
              $('#refund-funds').hide()
              $('#refund-count').html(`<p>商品未成交，已退款给买家!</p>`)
              $('#product-status').html(`<p></p>产品状态：拍卖已结束!`)
          } else if (sellerVoteCount > 1) {
              $('#release-funds').hide()
              $('#refund-funds').hide()
              $('#release-count').html(`<p>商品成交，已付款给卖家, 成交价：`+App.displayPrice(secondHighestBid)+`</p>`)
              $('#product-status').html(`<p></p>产品状态：拍卖已结束!`)
          } else {
              $('#release-count').html('Seller Vote Count:'+sellerVoteCount)
              $('#refund-count').html('Buyer Vote Count:'+buyerVoteCount)
          }
      } else {
          $('#bidding').hide()
          $('#revealing').hide()
          $('#finalize-auction').hide()
          $('#escrow-info').hide()
          $('#product-status').html('产品状态：拍卖结束，未卖出')
      }
  },

  bid: async function () {
      try {
          await instance.bid($('#product-id').val(),web3.toWei($('#bid-amount').val(),'ether'),$('#secret-text').val(),{value:web3.toWei($('#bid-send-amount').val(),'ether'),from:web3.eth.accounts[1],gas:3000000})
          alert('success')
          window.location.reload(true)
      } catch (e) {
          console.log(e)
      }
  },

  revealBid: async function () {
      try {
          await instance.revealBid($('#product-id').val(),web3.toWei($('#actual-amount').val(),'ether'),$('#reveal-secret-text').val(),{from:web3.eth.accounts[1],gas:3000000})
          alert('success')
          window.location.reload(true)
      } catch (e) {
          console.log(e)
      }
  },

    finalizeAuction: async function () {
        try {
            await instance.finalizeAuction($('#product-id').val(),{from:web3.eth.accounts[2],gas:3000000})
            alert('success')
            window.location.reload(true)
        } catch (e) {
            console.log(e)
        }
    },

    voteForSeller: async function () {
        try {
            await instance.voteForSeller($('#product-id').val(),{from:web3.eth.accounts[2],gas:3000000})
            alert('success')
            window.location.reload(true)
        } catch (e) {
            console.log(e)
        }
    },

    voteForBuyer: async function () {
        try {
            await instance.voteForBuyer($('#product-id').val(),{from:web3.eth.accounts[0],gas:3000000})
            alert('success')
            window.location.reload(true)
        } catch (e) {
            console.log(e)
        }
    },

  displayPrice: function (x) {
      return web3.fromWei(x,'ether')+'ETH'
  },

  displayTime: function (x) {
      var time = new Date(x*1000)
      var y = time.getFullYear()
      var m = time.getMonth()+1
      if (m < 10) m = '0' + m
      var d = time.getDate()
      if (d < 10) d = '0' + d
      var h = time.getHours()
      if (h < 10) h = '0' + h
      var M = time.getMinutes()
      if (M < 10) M = '0' + M
      return y + '-' + m + '-' + d + ' ' + h + ':' + M
  },

  displayEnd: function (x) {
      var now = parseInt(new Date()/1000)
      if (x<=now) return "Auction has ended"
      var s = x-now
      var d = parseInt(s/60/60/24)
      s -= d*60*60*24
      var h = parseInt(s/60/60)
      s -= h*60*60
      var M = parseInt(s/60)
      s -= M*60
      if (d>0) return 'Auction will end in '+d+' days '+(h<10?'0'+h:h)+':'+(M<10?'0'+M:M)+':'+(s<10?'0'+s:s)
      else if (h>0) return 'Auction will end in '+(h<10?'0'+h:h)+':'+(M<10?'0'+M:M)+':'+(s<10?'0'+s:s)
      else if (M>0) return 'Auction will end in '+(M<10?'0'+M:M)+':'+(s<10?'0'+s:s)
      else return 'Auction will end in '+s+' second(s)'
  },

  addImageToIPFS: function (reader) {
    return new Promise(async function (resolve, reject) {
        try {
            let r = await ipfs.add(Buffer.from(reader.result))
            resolve(r[0].hash)
        } catch (e) {
            reject(e)
        }
    })
  },

  addIntroToIPFS: function (intro) {
    return new Promise(async function (resolve, reject) {
        try {
            let r = await ipfs.add(Buffer.from(intro,'utf-8'))
            resolve(r[0].hash)
        } catch (e) {
            reject(e)
        }
    })
  }
}

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  /*
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider)
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }
  */
  window.web3=new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  App.start()
})
