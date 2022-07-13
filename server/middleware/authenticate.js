import jwt from 'jsonwebtoken';
import config from '../config';
var knex = require('../db.js');

// This looks at the token in the header and verifies it.
export default (req, res, next) => {
	const authorizationHeader = req.headers['authorization'];
	let token;

	if (authorizationHeader) {
		token = authorizationHeader.split(' ')[1];
	}

	if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
				res.status(401).json({ error: 'Failed to authenticate' });
			} else {
        knex
				  .select('id', 'username', 'email')
				  .from('person')
				  .where('id', decoded.id)
          .then(person => {
            if(person) {
					    req.currentUser = user;
					    next();
			      } else {
              knex
      				  .select('id', 'username', 'email')
      				  .from('person')
      				  .where('id', decoded.id)
        				.then(person => {
        					if (!(person)) {
        						res.status(404).json({ error: 'No such user' });
        					} else {
        					    req.currentUser = user;
        					    next();
        			    }
								})
                .catch(errors => {
								  console.log("Error in authenticate.js:46: ", errors);	
									res.status(500).json({ error: errors });
				        });
			      }
          })
          .catch(errors => {
    			  console.log("Error in authenticate.js:52: ", errors);	
    				res.status(500).json({ error: errors });
          });
			}
		});
	} else {
		res.status(403).json({
			error: 'No token provided'
		});
	}
}

