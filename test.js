const ECommerce = artifacts.require('./ECommerce.sol')
module.exports = async function () {
  console.log(web3.eth.accounts)
  try {
    let instance = await ECommerce.deployed()
    /*let now = parseInt(new Date() / 1000)
    await instance.addGoods('iPhone 8', 'smart phone', '', '', 0, web3.toWei('1', 'ether'), now, now + 60)
    let totalGoods = await instance.totalGoods()
    let r = await instance.goodsInfo(totalGoods)
    console.log(r)
    for (let i = 0; i < 6; i++) console.log(web3.eth.getBalance(web3.eth.accounts[i]))
    await instance.bid(totalGoods, web3.toWei('1.2', 'ether'), 'a1', { from:web3.eth.accounts[1],value:web3.toWei('.9', 'ether') })
    await instance.bid(totalGoods, web3.toWei('2', 'ether'), 'a2', { from:web3.eth.accounts[2],value:web3.toWei('3.3', 'ether') })
    await instance.bid(totalGoods, web3.toWei('3', 'ether'), 'a3', { from:web3.eth.accounts[3],value:web3.toWei('3', 'ether') })
    await instance.bid(totalGoods, web3.toWei('1.5', 'ether'), 'a4', { from:web3.eth.accounts[4],value:web3.toWei('1.6', 'ether') })
    await instance.bid(totalGoods, web3.toWei('2.6', 'ether'), 'a5', { from:web3.eth.accounts[5],value:web3.toWei('2.8', 'ether') })
    for (let i = 0; i < 6; i++) console.log(web3.eth.getBalance(web3.eth.accounts[i]))*/
    let totalGoods = await instance.totalGoods()
    /*await instance.revealBid(totalGoods, web3.toWei('1.2', 'ether'), 'a1', { from:web3.eth.accounts[1] })
    await instance.revealBid(totalGoods, web3.toWei('2', 'ether'), 'a2', { from:web3.eth.accounts[2] })
    await instance.revealBid(totalGoods, web3.toWei('3', 'ether'), 'a3', { from:web3.eth.accounts[3] })
    await instance.revealBid(totalGoods, web3.toWei('1.5', 'ether'), 'a4', { from:web3.eth.accounts[4] })
    await instance.revealBid(totalGoods, web3.toWei('2.6', 'ether'), 'a5', { from:web3.eth.accounts[5] })
    for (let i = 0; i < 6; i++) console.log(web3.eth.getBalance(web3.eth.accounts[i]))
    let r = await instance.getBalance()
    console.log(r)*/
    /*await instance.finalizeAuction(totalGoods, { from:web3.eth.accounts[5] })
    for (let i = 0; i < 6; i++) console.log(web3.eth.getBalance(web3.eth.accounts[i]))
    let r = await instance.escrowBalance(totalGoods)
    console.log(r)
    r = await instance.goodsInfo(totalGoods)
    console.log(r)*/
    /*await instance.voteBuyer(totalGoods, { from:web3.eth.accounts[3] })
    await instance.voteBuyer(totalGoods, { from:web3.eth.accounts[5] })
    for (let i = 0; i < 6; i++) {
      console.log(web3.eth.getBalance(web3.eth.accounts[i]))
      let r = await instance.escrowInfo(totalGoods, { from:web3.eth.accounts[i] })
      console.log(r)
    }*/
    /*await instance.voteSeller(totalGoods, { from:web3.eth.accounts[0] })
    await instance.voteSeller(totalGoods, { from:web3.eth.accounts[5] })
    for (let i = 0; i < 6; i++) {
      console.log(web3.eth.getBalance(web3.eth.accounts[i]))
      let r = await instance.escrowInfo(totalGoods, { from:web3.eth.accounts[i] })
      console.log(r)
    }*/
  } catch (e) {
    console.log(e)
  }
}
