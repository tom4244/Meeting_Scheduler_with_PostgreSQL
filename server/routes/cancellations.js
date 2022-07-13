import express from 'express';

var knex = require('../db.js');

let router = express.Router();

router.post('/', (req, res) => {
  knex('session')
	  .whereIn('id', req.body)
	  .del()

	.then(msg => res.json({success: true, msg: msg }))
  .catch(errors => res.status(500).json({ error: errors }));
});

export default router;
