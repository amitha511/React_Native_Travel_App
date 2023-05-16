const app = require('../server')
const request = require('supertest')
const mongoose = require('mongoose')
const { response } = require('../server')
const User = require('../models/user_model')

const userEmail = 'test@gmail.com'
const userPassword = '1234567'

beforeAll(done => {
    User.remove({ 'email': userEmail }, (err) => {
        done()
    })
})

afterAll(done => {
    User.remove({ 'email': userEmail }, (err) => {
        mongoose.connection.close()
        done()
    })
})

describe('Testing Post API', () => {
    const postMessage = 'test post'
    const sender = 'Idan'
    let accessToken = ''
    let userId = ''

    test('test registration', async () => {
        const response = await request(app).post('/auth/register').send({
            'email': userEmail,
            'password': userPassword
        })
        expect(response.statusCode).toEqual(200)
        userId = response.body._id
    })

    test('test login', async () => {
        const response = await request(app).post('/auth/login').send({
            'email': userEmail,
            'password': userPassword
        })
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken
    })

    test('post get', async () => {
        const response = await request(app).get('/post').set({ authorization: 'JWT ' + accessToken })
        expect(response.statusCode).toEqual(200)
    })

    test('add new post', async () => {
        const response = await request(app).post('/post').set({ authorization: 'JWT ' + accessToken }).send({
            'message': postMessage,
            'sender': sender
        })
        expect(response.statusCode).toEqual(200)
        const newPost = response.body
        expect(newPost.message).toEqual(postMessage)

        const response2 = await request(app).get('/post/' + newPost._id).set({ authorization: 'JWT ' + accessToken })
        expect(response2.statusCode).toEqual(200)
        const post2 = response2.body
        expect(post2.message).toEqual(postMessage)
    })
})