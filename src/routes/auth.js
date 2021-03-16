const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('748723176251-kk8i1m6h1dmcduriooi86c2o6f61v5m0.apps.googleusercontent.com')

async function verify (token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: '748723176251-kk8i1m6h1dmcduriooi86c2o6f61v5m0.apps.googleusercontent.com'
  })
  const payload = ticket.getPayload()
  console.log('user validated', payload)
}

module.exports = { verify }
