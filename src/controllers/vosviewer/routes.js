const { Router } = require('express')
const VosViewerController = require('./controller')
const router = new Router()
const controller = new VosViewerController()

const routes = [
  {
    method: 'post',
    path: '/vosviewer/cypher/',
    action: controller.create
  }
]

const allRouter = routes.map(({
  method,
  path,
  middleware,
  action,
  callback = []
}) => router[method](path, action, callback))

module.exports.router = allRouter
