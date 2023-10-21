const { response } = require('express');
const { Router } = require('express');
const router = Router();
const { ensureUnauthUser, enSuremainUser} = require('../middleware/auth')
const ObjectId = require('mongoose').Types.ObjectId;

const StorySchema = require('../models/storybook')
const User = require('../models/User')
// get req to Add page

router.get('/add', ensureUnauthUser,  (req, res) =>{
    res.render('stories/add')
})

// post to the user

router.post('/', ensureUnauthUser,  async(req, res) =>{
    try {
        req.body.user = req.user.id;
        const newStory = await StorySchema.create(req.body);
        newStory.populate('user');
        res.redirect('/dashboard')
    } catch (err) {
        res.render('erros/500')
        console.log(err)
    }
})

// get req to show pubconst stlic stories

router.get('/', ensureUnauthUser,  async(req, res) =>{
 try {
     const stories = await StorySchema.find({ status: 'public' })
     .populate('user')
     .sort({ createdAt: 'desc' })
     .lean()
    
     res.render('stories/index', {
         stories,
     })

 } catch (err) {
     console.log(err)
     res.render('erros/500')
 }
})

// get req to edit page

router.get('/edit/:id', ensureUnauthUser,  async(req, res) =>{
    try{
   const story = await StorySchema.findOne({_id: req.params.id})
   .lean()

   if(!story){
    res.render('erros/400')
   }

   if(story.user != req.user.id){
    res.redirect('/stories')
   }else{
    res.render('stories/edit', {
        story,
    })
   }}
   catch (err) {
    console.log(err)
    res.render('/erros/400')
}
})

// put req to user story through the edit page

router.put('/:id', ensureUnauthUser,  async(req, res) =>{
    try{
        let story = await StorySchema.findById(req.params.id)
        .lean()

        if(!story){
         return res.render('erros/404')
        }
     
        if(story.user != req.user.id){
         res.redirect('/stories')
        }else{
         story = await StorySchema.findOneAndUpdate(  {_id: req.params.id}, req.body,{
            new: true,
            runValidators: true
         })
         res.redirect('/dashboard')
        }
    }
    catch (err) {
        console.log(err)
        res.render('/erros/500')
    }
 })

 //delet req // deletes the story with the id

router.delete('/:id', ensureUnauthUser,  async(req, res) =>{
    try {
        await StorySchema.findByIdAndDelete({ _id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.redirect('/erros/404')
    }
})

//view re // view each story by id
router.get('/:id', ensureUnauthUser,  async(req, res) =>{
    try {
        const story = await StorySchema.findById({ _id: req.params.id})
        .populate('user')
        .lean()
        if(!story){
            return "";
        }

        res.render('stories/view', {
            story
        })
    } catch (err) {
        console.log(err)
        res.redirect('/erros/404')
    }
})
// get req to show user stories

router.get('/user/:userId', ensureUnauthUser,  async(req, res) =>{
    try {
        const stories = await StorySchema.find({ 
            user: req.params.userId,
            status: 'public'
        }).populate('user')
        .lean()

        res.redirect('stories/index', {
            stories
        })
    } catch (err) {
        console.log(err)
        res.redirect('erros/404')
    }
})



module.exports = router;