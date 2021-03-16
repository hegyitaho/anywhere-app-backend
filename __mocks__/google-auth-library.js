module.exports = {
  OAuth2Client: function () {
    console.log('OAuth2Client')
    return {
      verifyIdToken: () => ({
        getPayload: () => ({})
      })
    }
  }
}
