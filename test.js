
const axios = require('axios')


class GasAlert {

  constructor() {
    this.url = 'https://www.gasnow.org/api/v3/gas/price'
  }

  async getGasPrice() {
    const res = await axios.get(this.url)
    if (!res || !res.data || !res.data.code == 200 || !res.data.data) {
      // TODO: throw error
      return false
    }

    return res.data.data
  }

  async _checkPrices(alertPrice, txSpeed) {
    console.log('\n-------------------------------------\n')
    console.log(`Checking ${txSpeed} gas price....\n`)
    const prices = await this.getGasPrice()
    if (!prices || !prices.timestamp) {
      // TODO: error
      console.log('ERROR')
      return
    }

    const price = prices[txSpeed]
    console.log(price, new Date(prices.timestamp))

    if (price <= alertPrice * 1000000000) {
      console.log('ALERT')
    } else {
      //console.log('Price too high')
    }
    console.log('\n-------------------------------------')
  }

  async alertWhenPriceIsBelow(alertPrice /* in Gwei */, txSpeed /* rapid/fast/standard/slow */) {
    txSpeed = txSpeed || 'standard'
    const minutes = 1
    const interval = minutes * 60 * 1000

    setInterval(this._checkPrices.bind(this, alertPrice, txSpeed), interval)
  }

}





const ga = new GasAlert()
ga.alertWhenPriceIsBelow(20, 'fast')

