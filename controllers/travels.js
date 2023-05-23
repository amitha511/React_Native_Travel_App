const Travel = require('../models/travel_model')

const getTravels = async (req, res) => {
    try {
        travels = await Travel.find()
        res.status(200).send(travels)
    } catch (error) {
        res.status(400).send({
            'status': 'fail',
            'error': error.message
        })
    }
}

const getTravelById = async (req, res) => {
    try {
        travels = await Post.findById(req.params.id)
        res.status(200).send(travels)
    } catch (error) {
        res.status(400).send({
            'status': 'fail',
            'error': error.message
        })
    }
}

const addNewTravel = (req, res) => {
    console.log('addNewTravel ' + req.body.message)
    sender = req.user.id

    const travel = Travel({
        message: req.body.message,
        sender: sender
    })

    travel.save((error, newTravel) => {
        if (error) {
            res.status(400).send({
                'status': 'fail',
                'error': error.message
            })
        } else {
            res.status(200).send(newTravel)
        }
    })
}

module.exports = {
    getTravels,
    getTravelById,
    addNewTravel
}