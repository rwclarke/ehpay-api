/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

 module.exports = {

   /***************************************************************************
    * Set the default database connection for models in the production        *
    * environment (see config/connections.js and config/models.js )           *
    ***************************************************************************/

   models: {
     connection: 'mongo',
     migrate: 'safe',
     schema: true
   },

   /***************************************************************************
    * Set the socket connection in the production environment                 *
    ***************************************************************************/

   // sockets: {
   //   adapter: 'socket.io-redis', // @TODO this module must be installed first
   //   host: '127.0.0.1',
   //   port: 6379,
   //   db: 0,
   //   pass: '<redis auth password>',
   //   transports: "websocket",
   // },

   /***************************************************************************
    * Set the port in the production environment to 80                        *
    ***************************************************************************/

   port: process.env.PORT,

   /***************************************************************************
    * Set the log level in production environment to "silent"                 *
    ***************************************************************************/

   log: {
     level: "info" // Change this to 'warn' in production
   }

 };
