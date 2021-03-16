const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('748723176251-kk8i1m6h1dmcduriooi86c2o6f61v5m0.apps.googleusercontent.com')

async function verify (token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: '748723176251-kk8i1m6h1dmcduriooi86c2o6f61v5m0.apps.googleusercontent.com'
  })
  const { sub: googleId, given_name: firstName, family_name: lastName, email } = ticket.getPayload()
  console.log('user validated', { googleId, firstName, lastName, email })
  return { googleId, firstName, lastName, email }
}

module.exports = { verify }
