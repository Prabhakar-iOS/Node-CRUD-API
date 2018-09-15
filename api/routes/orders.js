let express = require('express')
let router = express.Router()

let checkAuth = require('../middleware/checkAuth')

let OrderController = require('../controllers/orders')

router.get('/', checkAuth, OrderController.orders_get_all)

router.post('/', checkAuth, OrderController.orders_create_order)

router.get('/:orderId', checkAuth, OrderController.orders_get_order)

router.delete('/:orderId', checkAuth, OrderController.orders_delete_order)

module.exports = router