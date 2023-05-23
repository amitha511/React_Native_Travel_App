import request from 'supertest'
import app from '../server'
import mongoose from 'mongoose'
import Post from '../models/travel_model'
import Post from '../models/post_model'
import User from '../models/user_model'

const userEmail = 'test@gmail.com'
const userPassword = '1234567'
let accessToken = ''
let refreshToken = ''

beforeAll(async () => {
    await Post.remove()
    await User.remove()
})

afterAll(async () => {
    await Post.remove()
    await User.remove()
    mongoose.connection.close()
})

describe('Testing Auth API', () => {

    test('Not authorized attempt test', async () => {
        const response = await request(app).get('/post')
        expect(response.statusCode).not.toEqual(200)
    })

    test('test Registration', async () => {
        const response = await request(app).post('/auth/register').send({
            'email': userEmail,
            'password': userPassword
        })
        expect(response.statusCode).toEqual(200)
    })

    test("Login test wrong password", async () => {
        const response = await request(app).post('/auth/login').send({
            "email": userEmail,
            "password": userPassword + '4'
        })
        expect(response.statusCode).not.toEqual(200)
        const access = response.body.accessToken
        expect(access).toBeUndifined()
    })

    test('test Login', async () => {
        const response = await request(app).post('/auth/login').send({
            'email': userEmail,
            'password': userPassword
        })
        expect(response.statusCode).toEqual(200)
        accessToken = response.body.accessToken
        expect(accessToken).not.toBeNull()
        refreshToken = response.body.refreshToken
        expect(refreshToken).not.toBeNull()
    })

    test('test using valid access token', async () => {
        // test using valid token
        const response = (await request(app).get('/post')).set('Authorization', 'JWT' + accessToken)
        expect(response.statusCode).toEqual(200)
    })

    test('test using wrong access token', async () => {
        // test using wrong token
        const response = (await request(app).get('/post')).set('Authorization', 'JWT 1' + accessToken)
        expect(response.statusCode).not.toEqual(200)
    })

    // test expired token
    jest.setTimeout(30000)
    test("test expired token", async () => {
        await new Promise(r => setTimeout(r, 10000))
        const response = await request(app).get("/post").set({ authorization: 'JWT' + accessToken })
        expect(response.statusCode).not.toEqual(200)
    })

    test("Refresh Token", async () => {
        let response = await request(app).get('/auth/refreshToken').set({ authorization: 'JWT' + refreshToken })
        expect(response.statusCode).toEqual(200)
        const newAccessToken = response.body.accessToken
        const newRefreshToken = response.body.refreshToken
        expect(newAccessToken).not.toEqual(null)
        expect(newRefreshToken).not.toEqual(null)
        response = await request(app).get("/post").set({ authorization: 'JWT' + accessToken })
        expect(response.statusCode).not.toEqual(200)
    })

    test("test Logout", async () => {
        const response = (await request(app).get('/auth/logout')).set({ authorization: 'JWT' + refreshToken })
        expect(response.statusCode).toEqual(200)
    })

})

