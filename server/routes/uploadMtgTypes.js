import express from 'express';

var knex = require('../db.js');

let router = express.Router();

router.post('/', (req, res) => {
	console.log("uploadMtgTypes req.body: ", req.body, "  req.params: ", req.params);
  console.log("Meeting types uploaded for", req.body.user);
  knex('person')
	  .where('username', req.body.user)
	  .update({
			mtg_types: req.body.mtg_types
		})
	  .then(msg => res.json({success: true, msg: msg }))
	  .catch (errors => res.status(500).json({ error: errors}));
});

router.get('/:user', (req, res) => {
	console.log("Getting user meeting types; req.params: ", req.params);
  knex('person')
	  .select('mtg_types')
	  .where('username', req.params.user)
	  .then(data => {
			console.log("data in uploadMtgTypes get: ", data);
			res.json({data});
		})
	  .catch(errors => {
			console.log("Errors in uploadMtgTypes get: ", errors);
      res.status(500).json(errors);
		});

});

export default router;
