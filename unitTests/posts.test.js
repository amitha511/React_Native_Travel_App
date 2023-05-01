const app = require('../server')
const { response } = require('../server')
const request = require('supertest')
const mongoose = require('mongoose')
const User = require('../models/user_models')

const email = 'test@a.com'
const password = '123456'

beforeAll(done => {
    User.remove({ 'email': email }, (error) => {
        done()
    })
})

afterAll(done => {
    User.remove({ 'email': email }, (error) => {
        mongoose.connection.close()
        done()
    })
})

describe('Testing Post API', () => {
    const postMessage = 'test post'
    const sender = 'Idan'

    test('test registration', async () => {
        const response = await request(app).post('/auth/register').send({
            'email': email,
            'password': password
        })
        expect(response.statusCode).toEqual(200)
    })

    test('test login', async () => {
        const response = await request(app).post('/auth/login').send({
            'email': email,
            'password': password
        })
        expect(response.statusCode).toEqual(200)
    })

    test('post get', async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).toEqual(200)
    })

    test('add new post', async () => {
        const response = await request(app).post('/post').send({
            'message': postMessage,
            'sender': sender
        })
        expect(response.statusCode).toEqual(200)
        const newPost = response.body.post
        expect(newPost.message).toEqual(postMessage)
        expect(newPost.sender).toEqual(sender)

        const response2 = await request(app).get('/post/' + newPost._id)
        expect(response2.statusCode).toEqual(200)
        const post2 = response2.body
        expect(post2.message).toEqual(postMessage)
        expect(post2.sender).toEqual(sender)
    })
})