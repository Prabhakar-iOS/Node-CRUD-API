let express = require('express')
let morgan = require('morgan')
let app = express()
let mongoose = require('mongoose')

let productRoutes = require('./api/routes/products')
let orderRoutes = require('./api/routes/orders')
let userRoutes = require('./api/routes/user')

mongoose.connect('mongodb://prabhaproduct:P123456_n@restfulapitut-shard-00-00-9vr1g.mongodb.net:27017,restfulapitut-shard-00-01-9vr1g.mongodb.net:27017,restfulapitut-shard-00-02-9vr1g.mongodb.net:27017/test?ssl=true&replicaSet=restfulapitut-shard-0&authSource=admin&retryWrites=true')
mongoose.Promise = global.Promise
let bodyParser = require('body-parser')
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With','Content-Type','Accept','Authorization')

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT','POST','PATCH','GET','DELETE')

        res.status(200).json({})
    }
    next()
})
app.use('/orders', orderRoutes)
app.use('/products', productRoutes)
app.use('/user', userRoutes)


app.use((req, res, next) => {
    let error = new Error('Not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})
module.exports = app