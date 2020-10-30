const vosviewer = require('./vosviewer/routes')

module.exports = (app) => {
  app.get('/api/v1/health', function (req, res) {
    res.status(200).send({
      internalCode: '200',
      message: 'Active Server ok',
      payload: null
    })
  })

  app.use('/api/v1/', vosviewer.router)
}
