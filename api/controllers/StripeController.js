/**
 * StripeController
 *
 * @description :: Server-side logic for managing stripes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {

	connect: function(req, res) {
		'use strict';
    var code = req.param('code');
    // Make /oauth/token endpoint POST request
    request.post({
        url: 'https://connect.stripe.com/oauth/token',
        form: {
            grant_type: "authorization_code",
            client_id: process.env.stripe_client_id || sails.config.local.stripe_client_id, //stripe connect app
            code: code,
            client_secret: process.env.stripe_client_secret || sails.config.local.stripe_client_secret, // stripe api secret key
        }
    }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            sails.log.error(err);
						return res.badRequest({
							error: body
						});
        } else {
					return res.ok({
						stripe: body
					});
        }
    });
	},

};
