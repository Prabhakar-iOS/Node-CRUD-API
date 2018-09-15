let express = require('express')
let router = express.Router()
let mongoose = require('mongoose')
let multer = require('multer')
let checkAuth = require('../middleware/checkAuth')
let ProductController = require('../controllers/products')

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
}) 

let fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
let upload = multer({storage: storage,
     limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})


let Product = require('../models/product')


router.get('/', checkAuth, ProductController.products_get_all )

router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product)

router.get('/:productId', checkAuth, ProductController.products_get_product)

router.patch('/:productId', checkAuth, ProductController.products_update_product)

router.delete('/:productId',  checkAuth, ProductController.products_delete_product)

module.exports = router