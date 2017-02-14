/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

 module.exports = {

   /***************************************************************************
    * Set the default database connection for models in the development       *
    * environment (see config/connections.js and config/models.js )           *
    ***************************************************************************/

   models: {
     connection: 'mongo',
     migrate: 'alter',
     schema: true
   },

   /***************************************************************************
    * Set the socket connection in the development environment                *
    ***************************************************************************/

   // sockets: {
   //   adapter: 'memory',
   //   transports: "websocket",
   // },

   /***************************************************************************
    * Set the port in the development environment                             *
    ***************************************************************************/

   port: 1337,

   /***************************************************************************
    * Set the log level in development environment to "silent"                *
    ***************************************************************************/

   log: {
     level: "info"
   }

 };
