// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

import $ from 'jquery'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import ecommerce_artifacts from '../../build/contracts/ECommerce'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var ECommerce = contract(ecommerce_artifacts)

import ipfsAPI from 'ipfs-api'
const ipfs = ipfsAPI('127.0.0.1', 5001, { protocol: 'http' })

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts

window.App = {
  start: function () {
      if ($('#product-list').length > 0) App.getGoodsList()
      if ($('#add-item-to-store').length > 0) {
          let reader
          $('#product-image').change(function (e) {
              if (e.target.files.length < 1) return
              reader = new FileReader()
              reader.readAsArrayBuffer(e.target.files[0])
          })
          $('#add-item-to-store-btn').click(function () {
              let params = $('#add-item-to-store').serialize()
              let json = JSON.parse('{"' + params.replace(/"/g, '\\"').replace(/=/g, '":"').replace(/&/g, '","') + '"}')
              let data = {}
              Object.keys(json).forEach(function (k) {
                  data[k] = decodeURIComponent(decodeURI(json[k]))
              })
              App.addGoods(data, reader)
          })
      }
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
      if ($('#product-details').length > 0) {
          App.getGoodsDetail()
      }
  },

  getGoodsList: async function () {
      ECommerce.setProvider(web3.currentProvider)
      let instance = await ECommerce.deployed()
      let totalGoods = await instance.totalGoods.call()
      let html = ''
      for (let i = 1; i <= totalGoods; i++) {
          let goodsInfo = await instance.getGoods(i)
          let {0:id, 1:name, 2:category, 3:imageLink, 4:introLink, 5:status, 6:condition, 7:startPrice, 8:auctionStartTime, 9:auctionEndTime } = goodsInfo
          html += '<div>' +
              '<a href="product.html?id=' + id + '">' +
              '<img src="http://127.0.0.1:8080/ipfs/' + imageLink + '" width="200">' +
              '<div>' + name + '</div>' +
              '<div>' + category + '</div>' +
              '<div>Start: ' + App.displayTime(auctionStartTime) + '</div>' +
              '<div>End: ' + App.displayTime(auctionEndTime) + '</div>' +
              '<div>Start Price: ' + App.displayPrice(startPrice) + '</div>' +
              '</a>' +
              '</div>'
      }
      $('#product-list').html(html)
  },

  addGoods: async function (data, reader) {
      try {
          let imageLink = await App.addImageToIPFS(reader)
          let introLink = await App.addIntroToIPFS(data['product-description'])
          ECommerce.setProvider(web3.currentProvider)
          let instance = await ECommerce.deployed()
          await instance.addGoods(data['product-name'], data['product-category'], imageLink, introLink, data['product-condition'], web3.toWei(data['product-price'], 'ether'), parseInt(Date.parse(data['product-auction-start']) / 1000), parseInt(Date.parse(data['product-auction-end']) / 1000), { from:web3.eth.accounts[0], gas:3000000 })
          window.location.href = 'index.html'
      } catch (e) {
          console.log(e)
      }
  },

  getGoodsDetail: async function () {
      let goodsId = new URLSearchParams(window.location.search).get('id')
      ECommerce.setProvider(web3.currentProvider)
      let instance = await ECommerce.deployed()
      let info = await instance.getGoods(goodsId)
      let {0:id, 1:name, 2:category, 3:imageLink, 4:introLink, 5:status, 6:condition, 7:startPrice, 8:auctionStartTime, 9:auctionEndTime } = info
      $('#product-name').html(name)
      $('#product-auction-end').html(App.displayTimeLeft(auctionEndTime))
      let intro = await ipfs.cat(introLink)
      $('#product-desc').append(intro.toString())
      $('#product-price').html(App.displayPrice(startPrice))
      $('#product-image').html('<img src="http://127.0.0.1:8080/ipfs/' + imageLink + '" width="490">')
      $('#product-id').val(goodsId)
      let bidInfo = await instance.bidInfo(goodsId)
      let { 0:highestBid, 1:secondHighestBid, 2:highestBidder, 3:totalBidder } = bidInfo
      $('#product-bids').html(parseInt(totalBidder))
      if (status==0) {
          let now = parseInt(new Date() / 1000)
          if (now <= parseInt(auctionEndTime)) {
              $('#bidding').show()
              $('#revealing').hide()
              $('#finalize-auction').hide()
              $('#escrow-info').hide()
          } else if (now <= parseInt(auctionEndTime) + 10) {
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
      } else if (status==1) {
          let escrowInfo = await instance.escrowInfo(goodsId)
          let { 0:buyer, 1:seller, 2:arbiter, 3:buyerVoteCount, 4:sellerVoteCount, 5:voted, 6:over } = escrowInfo
          $('#bidding').hide()
          $('#revealing').hide()
          $('#finalize-auction').hide()
          $('#escrow-info').show()
          $('#product-status').html(`<p>产品状态：揭标已结束，最高价：`+App.displayPrice(highestBid)+`, 开始进入仲裁投票阶段!</p>`)
          $('#buyer').html(buyer)
          $('#seller').html(seller)
          $('#arbiter').html(arbiter)
          if (buyerVoteCount >= 2) {
              $('#release-funds').hide()
              $('#refund-funds').hide()
              $('#refund-count').html(`<p>商品未成交，已退款给买家!</p>`)
              $('#product-status').html(`<p>产品状态：拍卖已结束!</p>`)
          } else if (sellerVoteCount >= 2) {
              $('#release-funds').hide()
              $('#refund-funds').hide()
              $('#release-count').html(`<p>商品成交，已付款给卖家, 成交价：`+App.displayPrice(secondHighestBid))
              $('#product-status').html(`<p>产品状态：拍卖已结束!</p>`)
          } else {
              $('#release-count').html(`Seller Vote: `+sellerVoteCount)
              $('#refund-count').html(`Buyer Vote: `+buyerVoteCount)
          }
      } else {
          $('#bidding').hide()
          $('#revealing').hide()
          $('#finalize-auction').hide()
          $('#escrow-info').hide()
          $('#product-status').html(`<p>产品状态：拍卖已结束!</p>`)
      }
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
              let r = await ipfs.add(Buffer.from(intro, 'utf-8'))
              resolve(r[0].hash)
          } catch (e) {
              reject(e)
          }
      })
  },

  bid: async function () {
      try {
          ECommerce.setProvider(web3.currentProvider)
          let instance = await ECommerce.deployed()
          await instance.bid($('#product-id').val(), web3.toWei($('#bid-amount').val(), 'ether'), $('#secret-text').val(), { from:web3.eth.accounts[1], gas:3000000, value:web3.toWei($('#bid-send-amount').val(), 'ether') })
      } catch (e) {
          console.log(e)
      }
  },

  revealBid: async function () {
      try {
          ECommerce.setProvider(web3.currentProvider)
          let instance = await ECommerce.deployed()
          await instance.revealBid($('#product-id').val(), web3.toWei($('#actual-amount').val(), 'ether'), $('#reveal-secret-text').val(), { from:web3.eth.accounts[1], gas:3000000 })
      } catch (e) {
          console.log(e)
      }
  },

  finalizeAuction: async function () {
      try {
          ECommerce.setProvider(web3.currentProvider)
          let instance = await ECommerce.deployed()
          await instance.finalizeAuction($('#product-id').val(), { from:web3.eth.accounts[2], gas:3000000 })
      } catch (e) {
          console.log(e)
      }
  },

  voteForBuyer: async function () {
      try {
          ECommerce.setProvider(web3.currentProvider)
          let instance = await ECommerce.deployed()
          await instance.voteForBuyer($('#product-id').val(), { from:web3.eth.accounts[0], gas:3000000 })
      } catch (e) {
          console.log(e)
      }
  },

  voteForSeller: async function () {
      try {
          ECommerce.setProvider(web3.currentProvider)
          let instance = await ECommerce.deployed()
          await instance.voteForSeller($('#product-id').val(), { from:web3.eth.accounts[2], gas:3000000 })
      } catch (e) {
          console.log(e)
      }
  },

  displayTime: function (x) {
    let d = new Date(x * 1000)
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    if (month < 10) month = '0' + month
    let day = d.getDate()
    if (day < 10) day = '0' + day
    let hour = d.getHours()
    if (hour < 10) hour = '0' + hour
    let minute = d.getMinutes()
    if (minute < 10) minute = '0' + minute
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
  },

  displayTimeLeft: function (x) {
      let now = parseInt(new Date() / 1000)
      let t = x - now
      if (t <= 0) return 'Auction has ended'
      let days = parseInt(t / 60 / 60 / 24)
      t -= days * 60 * 60 * 24
      let hours = parseInt(t / 60 / 60)
      t -= hours * 60 * 60
      let minutes = parseInt(t / 60)
      t -= minutes * 60
      if (days > 0) return days + ' days ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (t < 10 ? '0' + t : t)
      else if (hours > 0) return  (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (t < 10 ? '0' + t : t)
      else if (minutes > 0) return (minutes < 10 ? '0' + minutes : minutes) + ':' + (t < 10 ? '0' + t : t)
      else return t + ' second(s)'
  },

  displayPrice: function (x) {
    return web3.fromWei(x, 'ether') + 'ETH'
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
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  App.start()
})
