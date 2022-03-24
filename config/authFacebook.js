const FacebookStrategy = require('passport-facebook').Strategy


module.exports = (passport)=>{
    passport.serializeUser(function (userFacebook, cb) {
        cb(null, userFacebook);
      });
      
      passport.deserializeUser(function (obj, cb) {
        cb(null, obj);
      });
      
    
      passport.use(new FacebookStrategy({
          clientID: 'SEU CLIENTE ID',
          clientSecret: 'SEU CLIENT SECRET',
          callbackURL: 'http://localhost:3000/administrador'
        }, function (accessToken, refreshToken, profile, done) {
          return done(null, profile);
        }
      ));
}
