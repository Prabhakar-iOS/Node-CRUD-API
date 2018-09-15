let mongoose = require('mongoose')
let Product = require('../models/product')


exports.products_get_all = (req, res, next) => {
    Product.find()
    .select( "name price _id productImage")
    .exec()
    .then(doc => {
       let reponse = {
           count: doc.length,
           products: doc.map (item => {
               return {
                 name: item.name,
                price: item.price,
                productImage: item.productImage,
                 _id: item._id,
                 request: {
                     type: 'GET',
                     url: 'http:localhost:3000/products/'+ item.id
                 }
               }
           })
       }
        res.status(200).json(reponse)
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
}

exports.products_create_product = (req, res, next) => {
    console.log(req.file)
    let product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })

    product.save().then(result => {
        console.log(result)
        res.status(201).json({
            message: "This is Post products response",
            createdProduct: {
                name: product.name,
                price: product.price,
                _id: product._id,
                request: {
                    type: 'GET',
                    url: 'http:localhost:3000/products/'+ product.id
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
    
}

exports.products_get_product = (req, res, next) => {
    let id = req.params.productId
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log(doc)
        if (doc) {
            res.status(200).json({
                product: doc,
                request: 'GET',
                url: 'http:localhost:3000/products/'
            })
        } else {
            res.status(400).json({message: "There is no id"})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    })
}

exports.products_update_product = (req, res, next) => {
    let id = req.params.productId
    let updateOps = {}
     for (var ops of req.body) {
        updateOps[ops.propName] = ops.value
     }

     Product.update( { _id: id }, { $set: updateOps})
     .exec()
     .then(result => {
         res.status(200).json({
             message: 'Product updated',
             request: {
                 type: 'GET',
                 url: 'http:localhost:3000/products/' + id
             }
         })
     })
     .catch(err => {
         console.log(err)
         res.status(500).json({error: err})
     })
}

exports.products_delete_product = (req, res, next) => {
    let id = req.params.productId

    Product.remove({ _id: id} )
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product deleted',
            request: {
                type: 'GET',
                url: 'http:localhost:3000/products/',

                body: {name: 'String', price: 'Number'}
            }
        })
    })
    .catch(err => {
        res.status(500).json({error: err})
    })

}