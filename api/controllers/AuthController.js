/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 var moment = require('moment');

 function normalizeEmail (email) {
   return email.trim().toLowerCase();
 }

 module.exports = {

   login: function(req, res) {
     var body = _.pick(req.body, "email", "password");
     if(body.email && body.password){
       body.email = normalizeEmail(body.email);
       User.login(body, (err,user,token) => {
         if(!err){
           if(user && token){
             if(user.active){
               return res.ok({
                 authorization: "User "+token
               });
             }else{
               return res.forbidden({err: 'You have not verified your email'});
             }
           }else{
             return res.badRequest({err: 'Invalid Username or Password'});
           }
         }else{
           return res.serverError({err: err});
         }
       });
     }else{
       return res.badRequest({err: 'Email and Password required'});
     }
   },

   me: function (req,res) {
     'use strict';
     User.findOne(req.user.id).exec((err, user) => {
       if (err) return res.serverError({err: err});
       if (!user) return res.notFound({err: 'NotFound'});
       return res.ok(user);
     });
   },

   verify: function(req, res) {
     'use strict';
     User.findOne({verification: req.param('id')}).exec((err, user) => {
       if (err) return res.serverError(err);
       if (!user) return res.notFound('Invalid or expired verification link.');
       var canuse = moment(new Date (user.verification_expires));
       if (moment().diff(canuse) < 0) {
         User.update({
           verified: true,
           verification: 'Nice Try Buckaroo'
         }).exec((err, updatedUsers) => {
           if (err) return res.serverError(err);
           return res.ok();
         });
       } else {
         return res.badRequest({err: 'Invalid or expired verification link.'});
       }
     });
   }

 };
