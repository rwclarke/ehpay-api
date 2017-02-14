var jwt = require('jsonwebtoken');
// With this method we generate a new token based on payload we want to put on it
module.exports.issueToken = function(payload) {
  return jwt.sign(
      payload, // This is the payload we want to put inside the token
      sails.config.security.jwt.secret, // Secret string which will be used to sign the token
      {  //options
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );
};

// Here we verify that the token we received on a request hasn't be tampered with.
module.exports.verifyUserToken = function(token, cb) {
  jwt.verify(
    token, // The token to be verified
    sails.config.security.jwt.secret,// The secret we used to sign it.
    {
      algorithm: 'HS256'
    }, // Options, none in this case
    function(err, verified){
      if(!err && verified){
        //console.log(verified);
        User.findOne(verified.sid, function(err,user){
          if(!err && user){
            return cb(null,{
              user: user.toJSON(),
              iat: verified.iat
            });
          }else{
            if(err){
              return cb(err);
            }else{
              return cb('invalid or expired session');
            }
          }
        });
      }else{
        if(!err){
          return cb('invalid or expired session');
        }else{
          var msg = err.message ? err.message : 'invalid or expired session';
          return cb(msg);
        }
      }
    } // The callback to be call when the verification is done.
  );
};
