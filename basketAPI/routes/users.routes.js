const router = require('express').Router()
const mongoose = require('mongoose');
const User = require('./../models/User.model')
const Comment = require('./../models/Comments.model')
const Match = require('./../models/Match.model')


//GET ALL USERS
router.get('/', (req, res, next) => {

    User
        .find()
        .then(user => {
            res.render('users/users-list', { user })
        })
        .catch(err => console.log(err))
})


//GET USERS PROFILE
router.get('/:id', (req, res, next) => {
    let data = {}
    const { id } = req.params
    const objectId = mongoose.Types.ObjectId(req.params);
    User
        .findById(id)
        .then(user => {
            data.user = user
            return Comment.find()
        })
        .then(comments => {
            const currentReceiverId = mongoose.Types.ObjectId(req.params)
            comments.forEach(elem=>{
                if (comments.receiver == currentReceiverId) {
                    data.commentsOnProfile = elem
                    console.log('------------------COMENTARIOS DE ESTE PERFIL---------------'+ data.commentsOnProfile)
                }
            })
            
            res.render('users/profile', data)
        })
        .catch(err => console.log(err))
})

//COMMENT POST

router.post('/:id/comment', (req, res, next) => {
    const objectId = mongoose.Types.ObjectId(req.params);
    const {
        comment,
        owner = req.session.currentUser._id,
        receiver = objectId
    } = req.body

    Comment
        .create({ comment, owner, receiver })
        .then(() => {
            res.redirect('/')
        })
        .catch(err => console.log(err))
})

module.exports = router
