const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
const apiRoutes = require('./src/controllers')
const app = express()

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

apiRoutes(app)

app.listen(port, host, err => {
  if (err) { process.exit(err) }
  console.log(`
        Listening at PORT: ${host}:${port}

        @org: Dataverz ApS.
        @date: ${moment().format()}
        @address: Copenhagen, Denmark.
        @enviroment: ${process.env.NODE_ENV}
      `)
})
