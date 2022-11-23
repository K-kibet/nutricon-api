const router = require('express').Router();
const Post = require('../models/Post');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require('./verifyToken');

//CREATE A POST
router.post('/', verifyToken, async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE A POST
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{ 
        const updatedPost = Post.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//DELETE A POST
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json('Order has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET A POST
router.get('/:id', async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})



//Get ALL POSTS
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let posts;

        if(qNew) {
            posts= await new Post.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory) {
            posts = await new Post.find({categories: {
                $in: [qCategory]
            }})
        } else {
            posts = await Post.find();
        }

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;