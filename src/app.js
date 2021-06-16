const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// loading bbs
const hbs = require('hbs')

// console.log(path.join(__dirname, '../public'))
// console.log(__dirname)
// console.log(__filename)

//  TODO=> storing express application
const app = express()
//  TODO=> Define paths for express config

const port = process.env.PORT || 3000
const publicDirectorypath = path.join(__dirname, '../public')
const viewsFolderPath = path.join(__dirname, '../templates/views')
const partialsFolderPath = path.join(__dirname, '../templates/partials')

// const publicDirectorypathToAbout = path.join(__dirname, '../public/about.html')
// TODO=>setting up handle bars and view location (template engine)
app.set('view engine', 'hbs');
app.set('views', viewsFolderPath);
hbs.registerPartials(partialsFolderPath)

// TODO=>Set up static directory to serve
app.use(express.static(publicDirectorypath))
// TODO=>To accept post request
app.use(express.urlencoded({ extended: false }))
// app.use(express.static(publicDirectorypathToAbout))

//Setting route 
// app.get('', (req, res) => {

//     //    TODO=> when some api request comes bottom send response will shown in browser or api
//     res.send('Hello express!')
// })

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Welcome to weather app',
    })
})

app.get('/about', (req, res) => {
    // res.send('<h1>About page.</h1>')
    res.render('about', {
        title: 'Weather',
        name: 'Midhulesh k m'
    })
})


app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Weather',
        message: 'From this page you will get help about weather'
    })
})


app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({ error: 'Address must be provided.' })
    }
    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error: error })
        }


        forecast(latitude, longitude, (error, forecastData = '') => {
            if (error) {
                return res.send({ error: error })
            }
            console.log(location)
            res.send({ location: location, forecast: forecastData, address: address })

        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({ error: 'You must provide a search term' })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })

})

app.post('/products', (req, res) => {
    if (!req.body.search) {
        return res.send({ error: 'You must provide a search term' })
    }
    console.log(req.body.search)
    res.send({
        products: [{ result: req.body.search }]
    })

})

app.get('*', (req, res) => {
    res.send('This is 404 Page')
})

// TODO=> run express need to create a server and it will localy listen on port 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})