module.exports = {
    ensureUnauthUser: function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }else{
            res.send('/')
        }
    },
    enSuremainUser: function(req, res, next){
        if(req.isAuthenticated()){
        res.redirect('/dashboard')
    }else{
        return next()
    }
    }
}