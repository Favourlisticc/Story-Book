const { Router } = require('express');
const router = Router();
const { ensureUnauthUser, enSuremainUser} = require('../middleware/auth')

const StorySchema = require('../models/storybook')
// login/ landing page

router.get('/', enSuremainUser, (req, res) =>{
    res.render('login', {
        layout: 'login',
    })
})

//dashboard
// router.use((req, res, next) =>{
//     if(req.session.googleId) next();
//     else res.sendStatus(200)
//   })
router.get('/dashboard', ensureUnauthUser, async(req, res) =>{
  try {
    const storybook = await StorySchema.find({user: req.user.id}).lean()
    res.render('dashboard', {
        name: req.user.firstName,
        storybook
    })

  } catch (err) {
    console.log(err)
    res.render('error/500')
  }
})

router.get('/', enSuremainUser, (req, res) =>{
    res.render('login', {
        layout: 'login',
    })
})
module.exports = router;