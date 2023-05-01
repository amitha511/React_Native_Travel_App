const app = require('../server')
const request = require('supertest')
const mongoose = require('mongoose')
const { response } = require('../server')
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

describe('Testing Auth API', () => {
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
})