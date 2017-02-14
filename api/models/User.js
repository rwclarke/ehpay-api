/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 var getHash = require('machinepack-passwords');
 var moment = require('moment');

 module.exports = {

   attributes: {

     /* Basic Info */

     email: {
       type: 'email',
       required: true,
       unique: true
     },

     first_name: {
       type: 'string',
       required: true,
       alpha: true
     },

     last_name: {
       type: 'string',
       required: true,
       alpha: true
     },

     stripe_connect: {
       type: 'string',
       alpha: true
     },

     active: {
       type: 'boolean',
       defaultsTo: false
     },

     /* Password and reset */

     password: {
       type: 'string',
       minLength: 8
     },

     password_reset_token: {
       type: 'string'
     },

     /* Model functions*/

     hasStripeConnect: function() {
       return !!this.stripe_connect;
     },

     toJSON: function() {
       var user = this.toObject();

       return  _.omit(user, 'password', 'password_reset_token', 'stripe_connect', 'verification', 'verification_expires');
     },

     setPassword: function(newPassword) {
       var that = this;
       getHash.encryptPassword({
         password: newPassword,
         difficulty: 11,
       }).exec({
         error: (err) => {
           sails.log.error('Error encrypting data: ' + err);
           return that;
         },
         success: (hash) => {
           that.password = hash;
           that.password_reset_token = null;
           return that;
         },
       });
     }
   },

   /* Lifecycle Callbacks */

   beforeCreate: function(user, callback) {
     _.omit(user, 'verification', 'verified', 'verification_expires', 'password_reset_token');
     User.findOne({email: user.email}).exec((err,exists) => {
       if (err || exists){
         sails.log.debug('User exists');
         callback('email already taken');
       }else{
         if (!user.business) user.admin = true;
         async.parallel([
           (cb) => {
             getHash.encryptPassword({password: user.email}).exec({
               error: (err) => {
                 sails.log.error('Error encrypting data: ' + err);
                 cb('Unexpected error occured while creating verification code.');
               },
               success: (verification) => {
                 user.verification = verification;
                 user.verification_expires = moment(new Date()).add(3, 'days').format();
                 user.verified = false;
                 user.active = true;
                 cb();
               }
             });
           },
           (cb) => {
             getHash.encryptPassword({
               password: user.password,
               difficulty: 11,
             }).exec({
               error: (err) => {
                 sails.log.error('Error encrypting data: ' + err);
                 cb('Unexpected error occured while encrypting password');
               },
               success: (hash) => {
                 user.password = hash;
                 cb();
               },
             });
           }
         ], (err) => {
           callback(err, user);
         });
       }
     });
   },

   /* Login and management functions */

   login: function(credentials, cb) {
     User.findOne({email: credentials.email}).exec((err, user) => {
       if(!err){
         if(user){
           getHash.checkPassword({
             passwordAttempt: credentials.password,
             encryptedPassword: user.password
           }).exec({
             error: (err) => {
               sails.log.error('Error decrypting password: ' + err);
               return false;
             },
             incorrect: () => {
               if(err) sails.log.error(err);
               cb({status: 401, err: 'Invalid Username or Password'});
             },
             success: () => {
               if(user.active){
                 user.last_login = new Date();
                 var token = sailsTokenAuth.issueToken({sid: user.id});
                 user.save ((err) => {
                   if(!err){
                     cb(null, user.toJSON(), token);
                   }else{
                     sails.log.error(err);
                     cb(err);
                   }
                 });
               }else{
                 cb({status: 403, err: 'You have not verified your email'});
               }
             },
           });
         }else{
           cb({status: 404, err: 'NotFound'});
         }
       }else{
         sails.log.error(err);
         cb(err);
       }
     });
   },

 };
