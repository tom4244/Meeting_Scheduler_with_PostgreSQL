import express from 'express';
import commonValidations from '../shared/validations/signup';
import bcrypt from 'bcryptjs';
import isEmpty from 'lodash/isEmpty';
import base64url from 'base64url';
import fs from 'fs-extra';

var knex = require('../db.js');
var crypto = require('crypto');

let router = express.Router();

function validateInput(data, otherValidations) {
	let { errors } = otherValidations(data);

  return knex('person')
	  .where({username: data.username})
	  .orWhere({email: data.email})

		.then(user => {
  	if (user) {
  		if (user.username == data.username) {
  			errors.username = 'Someone already chose that username.';
  		}
  		if (user.email == data.email) {
  			errors.email = 'There is already an account with that email address.';
  		}
  	}
	  console.log("usersjs errors: ", errors, "  isEmpty(errors): ", isEmpty(errors));
  	return {
  		errors,
  		isValid: isEmpty(errors)
  	};
  })
}
  
function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

router.get('/', (req, res) => {

  knex
		.select('username', 'email', 'roomname', 'firstname', 'lastname')
		.from('person')
	  .orderBy('username', 'asc')

	.then(participantsList => {
		res.json({ participantsList });
	})
});

router.get('/:identifier', (req, res) => {

	knex
		.select('username', 'email', 'roomname', 'firstname', 'lastname')
		.from('person')
	  .where({username: req.params.identifier})
	  .orWhere({email: req.params.identifier})
	  .orderBy('username', 'asc')

		.then(user => {
			console.log("user in users.js: ", user);
		res.json({ user });
	})
});

//This is the userSignUpRequest
router.post('/', (req, res) => {
	
	console.log("validateInput req.body: ", req.body);
	validateInput(req.body, commonValidations)
		.then(({ errors, isValid }) => {
			console.log("users.js after validateInput errors: ", errors, "   isValid: ", isValid);
    	if (!isValid) { 
  			errors = errors + "Input not valid in users.js";
    		console.log("Input not valid in users.js");
  			res.status(400).json(errors);
    	}
			console.log("Input was valid in users.js");
			const userdata = req.body;
      userdata.roomname = randomStringAsBase64Url(8);
	  	const { username, password, email, firstname, lastname, roomname, mtgTypes} = userdata;
	    const password_digest = bcrypt.hashSync(password, 10);
      console.log("password was hashed by bcrypt and is in the password_digest");

				//Make a new user entry in the database
         fs.copy(__dirname + '/../../src/app/img/userPhotos/anonymous.jpg', __dirname + '/../../src/app/img/userPhotos/' + username + '.jpg')
         fs.copy(__dirname + '/../selfIntros/anonymous.txt', __dirname + '/../selfIntros/' + username + '.txt')
				 .then(() => {
									console.log("anonymous photo and self-intro files copied")
				 })
         .catch(error => {
					 console.log("Error in users.js during fs.copy: ", error)
				 });

        knex('person')
				  .insert({username: username, email: email, password_digest: password_digest, firstname: firstname, lastname: lastname, roomname: roomname, mtg_types: mtgTypes, self_intro: username + '.txt', photo: username + '.jpg'}) 

				.then(user => res.json({ success: true }))
	  	  .catch(err => res.status(500).json({ error: err }));
			// }

		})
	  .catch(err => res.status(508).json({ error: err }));

});

export default router;

