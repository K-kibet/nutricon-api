const router = require('express').Router();
const User = require('../models/User');
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');


//UPDATE USER
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if(req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try{ 
        const updatedUser = User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new: true});

        res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(500).json(err);
    }

})

//DELETE USER
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET USER
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const {...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET ALL USERS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try{
        const users = query ? await User.find().sort({_id: -1}).limit(5) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
})

//GET USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date ();
    const lastyear = new Date(date.getFullYear() - 1);

    try{
        const data = await User.aggregate([
            {
                $match: {
                    createdAt: {$gte: lastyear}
                }
            },
            {
                $project: {
                    month: {$month: "$createdAt"},
                }
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1},
                }
            }
        ]);

        res.status(200).json(data);

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;