let mongoose = require('mongoose')

let Order = require('../models/Order')
let Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            product: docs.map ( doc => {
                return {
                    _id: doc._id,
                    product: doc,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'+ doc.id
                    }
                }
            }),
            
        })
    })
}

exports.orders_create_order = (req, res, next) => {

    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
           return res.status(404).json({
                message: "Product not found"
            })
        }
        let order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        })
    
        order.save()
    })
    .then(result => {
        res.status(201).json({
            message: "Order saved",
            request: {
                type: "GET",
                url: 'http://localhost:3000/orders/'
            }
        })
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
    
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(doc => {
        res.status(200).json({
            order: doc,
            request: {
                type: "GET",
                url: 'http://localhost:3000/orders/'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.orders_delete_order = (req, res, next) => {
    Order.remove({_id: req.body.orderId})
    .exec()
    .then(message => {
        res.status({
            message: "Order deleted",
            request: { 
              type: "GET",
             url: 'http://localhost:3000/orders/'
            }
        })
    })
    .catch(err => {
        
    })
}