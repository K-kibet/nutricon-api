const router = require('express').Router();
const Post = require('../models/Post');
const Service = require('../models/Service');
const {verifyTokenAndAdmin} = require('./verifyToken');

//CREATE A SERVICE
router.post('/', async (req, res) => {
    const newService = new Service(req.body);
    try{
        const savedService = await newService.save();
        res.status(200).json(savedService);

    } catch (err) {
        res.status(500).json(err);
    }
})

//UPDATE A SERVICE
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{ 
        const updatedService = Service.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedService);
    } catch (err) {
        return res.status(500).json(err);
    }
})

//DELETE A SERVICE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Service.findByIdAndDelete(req.params.id);
        res.status(200).json('Service has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET A SERVICE
router.get('/find/:id', async (req, res) => {
    try{
        const service = await Service.findById(req.params.id);
        res.status(200).json(service);
    } catch (err) {
        res.status(500).json(err);
    }
})



//Get ALL POSTS
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let services;

        if(qNew) {
            services= await new Service.find().sort({createdAt: -1}).limit(5);
        } else if(qCategory) {
            services = await new Service.find({categories: {
                $in: [qCategory]
            }})
        } else {
            services = await Service.find();
        }

        res.status(200).json(services);

    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;