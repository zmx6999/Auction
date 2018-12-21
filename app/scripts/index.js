// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

import $ from 'jquery'

import ipfsAPI from 'ipfs-api'

// Import our contract artifacts and turn them into usable abstractions.
import ECommerceArtifact from '../../build/contracts/ECommerce'

// MetaCoin is our usable abstraction, which we'll use through the code below.
const ECommerce = contract(ECommerceArtifact)
let ECommerceInstance

const ipfs = ipfsAPI('127.0.0.1', 5001, { protocol:'http' })

const App = {
  start: async function () {
    // Bootstrap the MetaCoin abstraction for Use.
    console.log(web3.eth.accounts)
    ECommerce.setProvider(web3.currentProvider)
    ECommerceInstance = await ECommerce.deployed()
    if ($('#add-item-to-store').length > 0) {
      let reader
      $('#product-image').change(function (e) {
        if (e.target.files.length < 1) return
        reader = new FileReader()
        reader.readAsArrayBuffer(e.target.files[0])
      })
      $('#add-item-to-store-btn').click(function () {
        let _params = $('#add-item-to-store').serialize()
        let json = JSON.parse(`{"${_params.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)
        let params = {}
        Object.keys(json).forEach(function (key) {
          params[key] = decodeURIComponent(decodeURI(json[key]))
        })
        App.addGoods(params, reader)
      })
    }
    if ($('#product-list').length > 0) App.showGoodsList()
    if ($('#product-details').length > 0) {
      App.showGoodsDetail()
    }
    if ($('#bidding').length > 0) {
      $('#bidding-btn').click(function () {
        App.bid()
      })
    }
    if ($('#revealing').length > 0) {
      $('#revealing-btn').click(function () {
        App.revealBid()
      })
    }
    if ($('#finalize-auction').length > 0) {
      $('#finalize-auction-btn').click(function () {
        App.finalizeAuction()
      })
    }
    if ($('#refund-funds').length > 0) {
      $('#refund-funds').click(function () {
        App.voteBuyer()
      })
    }
    if ($('#release-funds').length > 0) {
      $('#release-funds').click(function () {
        App.voteSeller()
      })
    }
  },
  saveImageToIPFS: function (reader) {
    return new Promise(async (resolve, reject) => {
      try {
        let r = await ipfs.add(Buffer.from(reader.result))
        resolve(r[0].hash)
      } catch (e) {
        reject(e)
      }
    })
  },
  saveDescToIPFS: function (desc) {
    return new Promise(async (resolve, reject) => {
      try {
        let r = await ipfs.add(Buffer.from(desc, 'utf-8'))
        resolve(r[0].hash)
      } catch (e) {
        reject(e)
      }
    })
  },
  addGoods: async function (params, reader) {
    try {
      console.log(params)
      let imageLink = await App.saveImageToIPFS(reader)
      let descLink = await App.saveDescToIPFS(params['product-description'])
      let auctionStartTime = parseInt(Date.parse(params['product-auction-start']) / 1000)
      let auctionEndTime = parseInt(Date.parse(params['product-auction-end']) / 1000)
      await ECommerceInstance.addGoods(params['product-name'], params['product-category'], imageLink, descLink, params['product-condition'], web3.toWei(params['product-price'], 'ether'), auctionStartTime, auctionEndTime, { from:web3.eth.accounts[0] })
      window.location.href = 'index.html'
    } catch (e) {
      console.log(e)
    }
  },
  showGoodsList: async function () {
    let totalGoods = await ECommerceInstance.totalGoods()
    for (let i = 1; i <= totalGoods; i++) {
      let goods = await ECommerceInstance.goodsInfo(i)
      let { 0:id, 1:name, 2:category, 3:imageLink, 7:startPrice, 8:auctionStartTime, 9:auctionEndTime } = goods
      $('#product-list').append(`
        <div>
          <a href="product.html?id=${id}">
              <img width="200" src="http://127.0.0.1:8080/ipfs/${imageLink}"/>
              <div>${name}</div>
              <div>${category}</div>
              <div>${App.displayPrice(startPrice)}</div>
              <div>Start: ${App.displayTime(auctionStartTime)}</div>
              <div>End: ${App.displayTime(auctionEndTime)}</div>
          </a>
        </div>
      `)
    }
  },
  showGoodsDetail: async function () {
    let id = new URLSearchParams(window.location.search).get('id')
    let goods = await ECommerceInstance.goodsInfo(id)
    let { 0:goodsId, 1:name, 3:imageLink, 4:descLink, 5:status, 7:startPrice, 9:auctionEndTime } = goods
    $('#product-name').html(name)
    $('#product-image').html(`<img width="400" src="http://127.0.0.1:8080/ipfs/${imageLink}"/>`)
    $('#product-auction-end').html(App.displayEndTime(auctionEndTime))
    let r = await ipfs.cat(descLink)
    $('#product-desc').html(r.toString())
    $('#product-price').html(App.displayPrice(startPrice))
    $('#product-id').val(goodsId)
    let bidInfo = await ECommerceInstance.bidInfo(id)
    let { 0:highestBid, 1:secondHighestBid, 3:totalBids } = bidInfo
    $('#product-bids').html(parseInt(totalBids))
    $('#bidding,#revealing,#finalize-auction,#escrow-info,#refund-funds,#release-funds').hide()
    if (status == 0) {
      let now = App.getCurrentTimeInSeconds()
      if (now < auctionEndTime) {
        $('#bidding').show()
      } else if (now < parseInt(auctionEndTime) + 60) {
        $('#revealing').show()
      } else {
        $('#finalize-auction').show()
      }
    } else if (status == 1) {
      $('#escrow-info').show()
      $('#product-status').html(`<p>产品状态：揭标已结束，最高价：${App.displayPrice(highestBid)}, 开始进入仲裁投票阶段!</p>`)
      let escrowInfo = await ECommerceInstance.escrowInfo(id)
      let { 0:buyer, 1:seller, 2:arbiter, 3:buyerVoteCount, 4:sellerVoteCount } = escrowInfo
      $('#buyer').html(buyer)
      $('#seller').html(seller)
      $('#arbiter').html(arbiter)
      if (buyerVoteCount >= 2) {
        $('#refund-count').html(`<p>商品未成交，已退款给买家!</p>`)
        $('#product-status').html(`<p>产品状态：拍卖已结束!</p>`)
      } else if (sellerVoteCount >= 2) {
        $('#release-count').html(`<p>商品成交，已付款给卖家, 成交价：${App.displayPrice(secondHighestBid)}`)
        $('#product-status').html(`<p>产品状态：拍卖已结束</p>`)
      } else {
        $('#refund-funds').show()
        $('#release-funds').show()
        $('#refund-count').html(`Buyer Vote Count: ${buyerVoteCount}`)
        $('#release-count').html(`Seller Vote Count: ${sellerVoteCount}`)
      }
    } else {
      $('#product-status').html(`<p>产品状态：拍卖结束，未卖出</p>`)
    }
  },
  bid: async function () {
    try {
      let goodsId = parseInt($('#product-id').val())
      let idealPrice = $('#bid-amount').val()
      let sendPrice = $('#bid-send-amount').val()
      let secret = $('#secret-text').val()
      console.log(goodsId)
      console.log(web3.toWei(idealPrice, 'ether'))
      console.log(secret)
      console.log(web3.toWei(sendPrice, 'ether'))
      await ECommerceInstance.bid(goodsId, web3.toWei(idealPrice, 'ether'), secret, { from:web3.eth.accounts[0], value:web3.toWei(sendPrice, 'ether') })
      alert('success')
    } catch (e) {
      console.log(e)
    }
  },
  revealBid: async function () {
    try {
      let goodsId = parseInt($('#product-id').val())
      let idealPrice = $('#actual-amount').val()
      let secret = $('#reveal-secret-text').val()
      await ECommerceInstance.revealBid(goodsId, web3.toWei(idealPrice, 'ether'), secret, { from:web3.eth.accounts[0] })
      alert('success')
    } catch (e) {
      console.log(e)
    }
  },
  finalizeAuction: async function () {
    try {
      let goodsId = parseInt($('#product-id').val())
      await ECommerceInstance.finalizeAuction(goodsId, { from:web3.eth.accounts[0] })
      alert('success')
    } catch (e) {
      console.log(e)
    }
  },
  voteBuyer: async function () {
    try {
      let goodsId = parseInt($('#product-id').val())
      await ECommerceInstance.voteBuyer(goodsId, { from:web3.eth.accounts[0] })
      window.location.reload(true)
    } catch (e) {
      console.log(e)
    }
  },
  voteSeller: async function () {
    try {
      let goodsId = parseInt($('#product-id').val())
      await ECommerceInstance.voteSeller(goodsId, { from:web3.eth.accounts[0] })
      window.location.reload(true)
    } catch (e) {
      console.log(e)
    }
  },
  displayTime: function (x) {
    let t = new Date(x * 1000)
    let y = t.getFullYear()
    let m = t.getMonth() + 1
    if (m < 10) m = '0' + m
    let d = t.getDate()
    if (d < 10) d = '0' + d
    let h = t.getHours()
    if (h < 10) h = '0' + h
    let i = t.getMinutes()
    if (i < 10) i = '0' + i
    return y + '-' + m + '-' + d + ' ' + h + ':' + i
  },
  displayPrice: function (price) {
    return web3.fromWei(price, 'ether') + 'ETH'
  },
  getCurrentTimeInSeconds: function () {
    return parseInt(new Date() / 1000)
  },
  displayEndTime: function (x) {
    let r = x - App.getCurrentTimeInSeconds()
    if (r <= 0) return 'Auction has ended'
    let days = parseInt(r / (60 * 60 * 24))
    r -= 60 * 60 * 24 * days
    let hours = parseInt(r / (60 * 60))
    r -= 60 * 60 * hours
    let minutes = parseInt(r / 60)
    r -= 60 * minutes
    if (days > 0) {
      return 'Auction will end in ' + days + ' day(s) ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (r < 10 ? '0' + r : r)
    } else if (hours > 0) {
      return 'Auction will end in ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (r < 10 ? '0' + r : r)
    } else if (minutes > 0) {
      return 'Auction will end in ' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (r < 10 ? '0' + r : r)
    } else {
      return 'Auction will end in ' + r + ' second(s)'
    }
  }
}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'))
  }
  App.start()
})
