const express = require('express')
const router = express.Router()

const Travel = require('../controllers/travels')
const authenticate = require('../common/auth_middleware')

/* API specifications written in YAML */

/**
* @swagger
* tags:
*   name: Travel Api
*   description: The Travel API
*/

/**
* @swagger
* components:
*   schemas:
*     Travel:
*       type: object
*       required:
*         - message
*         - sender
*       properties:
*         message:
*           type: string
*           description: The travel text 
*         sender:
*           type: string
*           description: The user who send the travel id
*       example:
*         message: 'this is swagger test message'
*         sender: '1'
*/

router.get('/', authenticate, Travel.getTravels)

/**
* @swagger
* /travel/{id}:
*   get:
*     summary: get all travels
*     tags: [Travel Api]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The travel id
*     responses:
*       200:
*         description: The travels list
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Travel'
*/

router.get('/:id', authenticate, Travel.getTravelById)

/**
* @swagger
* /travel:
*   post:
*     summary: add new travel
*     tags: [Travel Api]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Travel'
*     responses:
*       200:
*         description: The travels list
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Travel'
*/

router.post('/', authenticate, Travel.addNewTravel)

module.exports = router;
