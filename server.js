const cors = require('cors')
const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const port = process.env.PORT

if (process.env.NODE_ENV == "development") {
    const swaggerUI = require("swagger-ui-express")
    const swaggerJsDoc = require("swagger-jsdoc")
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Node API",
                version: "1.0.0",
                description: "A simple Express Library API",
            },
            servers: [{ url: "http://localhost:" + port, },],
        },
        apis: ["./routes/*.js"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true, limit: '1m' }))
app.use(bodyParser.json())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => { console.error(error) })
db.once('open', () => { console.log('db connected') })

const indexRouter = require('./routes/index')
app.use('/', indexRouter)

const postRouter = require('./routes/post_routes')
app.use('/post', postRouter)

const travelRouter = require('./routes/travel_routes')
app.use('/travel', travelRouter)

const authRouter = require('./routes/auth_routes')
app.use('/auth', authRouter)

module.exports = app

