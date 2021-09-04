const dotenv = require('dotenv')
dotenv.config()
const twilioSid = process.env.TWILIO_ACCOUNT_SID
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN

const GasAlert = require('./index')


const ga = new GasAlert(twilioSid, twilioAuthToken, process.env.TWILIO_FROM, process.env.PHONE_TO_ALERT)
ga.alertWhenPriceIsBelow(20, 'fast')

//ga.sendText('150', 'fast')

