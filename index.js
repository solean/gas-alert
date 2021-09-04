
const axios = require('axios')


class GasAlert {

  constructor(twilioSid, twilioAuthToken, twilioFromNumber, phoneNumberToAlert) {
    if (!twilioSid || !twilioAuthToken || !twilioFromNumber || !phoneNumberToAlert) {
      throw new Error('Missing constructor arguments')
    }

    this.url = 'https://www.gasnow.org/api/v3/gas/price'
    this.twilioSid = twilioSid
    this.twilioAuthToken = twilioAuthToken
    this.twilioFromNumber = twilioFromNumber
    this.phoneNumberToAlert = phoneNumberToAlert
    this.twilio = require('twilio')(twilioSid, twilioAuthToken)
  }

  async getGasPrice() {
    const res = await axios.get(this.url)
    if (!res || !res.data || !res.data.code == 200 || !res.data.data) {
      throw new Error('Something went wrong when requesting gas price data.')
    }

    return res.data.data
  }

  async _checkPrices(alertPrice, txSpeed) {
    console.log('\n-------------------------------------\n')
    console.log(`Checking ${txSpeed} gas price....\n`)
    const prices = await this.getGasPrice()
    if (!prices || !prices.timestamp) {
      throw new Error('Something went wrong when parsing gas price data.')
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

  async sendText(gasPrice, txSpeed) {
    this.twilio.messages.create({
      body: 'Testing',
      from: this.twilioFromNumber,
      to: this.phoneNumberToAlert
    })
  }

}


module.exports = GasAlert

