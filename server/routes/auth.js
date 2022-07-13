import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
var knex = require('../db.js');

let router = express.Router();

router.post('/', (req, res) => {
	const { identifier, password } = req.body;
  console.log("identifier:22: ", identifier);
  knex('person')
	.where('username', identifier)
	.orWhere('email', identifier)
	.then(person => {
  	if (person[0]) {
			const { id, username, email, password_digest, firstname, lastname, roomname, mtg_types } = person[0];
      if (bcrypt.compareSync(password, password_digest)) {
  	    const token = jwt.sign({
  				id: id,
  				username: username
  			}, config.jwtSecret);
  			res.json({
  				token: token,
  				firstname: firstname,
          lastname: lastname,
          roomname: roomname,
					mtgTypes: mtg_types 
  			});
  		} else {
  		    res.status(401).json({ errors: { form: 'Invalid Credentials' } });
  		}
  	} else {
      knex('person')
      	.where('username', identifier)
      	.orWhere('email', identifier)
        .then(person => {
           if (person[0]) {
      			 const { id, username, email, password_digest, firstname, lastname, roomname } = person[0];
             if (bcrypt.compareSync(password, password_digest)) {
            	 const token = jwt.sign({
      		 	  	 id: id,
       		 		   username: username
        		 	 }, config.jwtSecret);
         		 	 res.json({
          		   token: token,
          		   firstname: firstname,
                 lastname: lastname,
                 roomname: roomname
         		 	 });
        		 } else {
           			     res.status(401).json({ errors: { form: 'Invalid Credentials' } });
           			 }
           		} else {
           			  res.status(401).json({ errors: { form: 'Invalid Credentials' } });
           		}
           	})
           	.catch(error => {
           		console.log("error found: ", error);
           	})
		}
	})
  .catch(error => {
  	console.log("error found: ", error);
  })
});

export default router;

