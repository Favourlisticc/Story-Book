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
     try {
        const user = await UserSchema.findById(id);
        done(null, user);
      } catch (err) {
        done(err);
      }

    })

module.exports = function(passport){
    passport.use(new GoogleStrategy({
        clientID: '707951848450-1e46thcck3v1m25a84oapuhh7776hb74.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "http://localhost:7000/auth/google/callback"
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
