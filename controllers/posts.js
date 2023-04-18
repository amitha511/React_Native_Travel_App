const Post = require('../models/post_models')

const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).send({
            'status': 'ok',
            'posts': posts
        });
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const posts = await Post.findById(req.params.id);
        res.status(200).send({
            'status': 'ok',
            'posts': posts
        });
    } catch (error) {
        next(error);
    }
};

const addNewPost = async (req, res, next) => {
    try {
        console.log('addNewPost ' + req.body.message);
        const post = new Post({
            message: req.body.message,
            sender: req.body.sender
        });
        const newPost = await post.save();
        res.status(200).send({
            'status': 'ok',
            'post': newPost
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPosts,
    getPostById,
    addNewPost
}