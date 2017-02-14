/**
 * userAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

 module.exports = function(req, res, next) {
   var token,
   bearer,
   credentials,
   authorization,
   parts;

   _.omit(req, 'authorization', 'user');

   if (req.headers && req.headers.authorization) {
     authorization = req.headers.authorization;
   }

   if(authorization){

     parts = authorization.split(' ');
     if (parts.length == 2) {
       bearer = parts[0];
       credentials = parts[1];

       if (/^User$/i.test(bearer)) {
         token = credentials;
       }
     } else {
       sails.log.error('Malformed auth token');
       return res.badRequest();
     }
     if(token){
       sailsTokenAuth.verifyUserToken(token, (err, authenticated) => {
         if(!err){
           req.user = authenticated.user;
           req.iat = authenticated.iat;
           next();
         }else{
           sails.log.error('sailsTokenAuth.verifyToken err: ', err);
           res.forbidden({err: err});
         }
       });
     }else{
       sails.log.error('No Token');
       res.badRequest();
     }
   }else{
     res.badRequest({err: 'No Authorization Header present'});
   }

 };
