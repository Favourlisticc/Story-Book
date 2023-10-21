const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const UserSchema = require('../models/User')

passport.serializeUser((user, done) => {
    console.log('Serializing user');
    done(null, user.id)

    })
    
    passport.deserializeUser( async(id, done) => {
     console.log("Deserializing")
     console.log(id)
     UserSchema.findById(id, (err, user) => done(err, user))

    })

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: '479187050423-07684o96pveqb67ig05ilr489pvibavj.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:5000/auth/google/callback"
      },
      async(accessToken, refreshToken, profile, done) => {
        console.log(profile)
        
        const newUser = {
            googleId: profile.id, 
            displayName: profile.displayName,
            firstName: profile.name.familyName, 
            lastName: profile.name.givenName,
            image: profile.photos[0].value,

        }

        try{
            let user = await UserSchema.findOne({googleId:profile.id})
        if(user){
            done(null, user)
        }else{
            user = await UserSchema.create(newUser)
            done(null, user)
        }
    }catch(err){
     console.log(err)
    }
    }
    ));
}
