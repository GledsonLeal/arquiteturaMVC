const FacebookStrategy = require('passport-facebook').Strategy


module.exports = (passport)=>{
    passport.serializeUser(function (userFacebook, cb) {
        cb(null, userFacebook);
      });
      
      passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
      });
      
      passport.use(new FacebookStrategy({
          clientID: '2055039021226946',
          clientSecret: 'a8b7a328256e15276d2471b9f0c840ac',
          callbackURL: 'http://localhost:3000/administrador'
        }, function (accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      ));
}