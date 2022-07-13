import express from 'express';

var knex = require('../db.js');

let router = express.Router();

router.get('/:user', (req, res) => {
const now = new Date();
  
	knex('session')
	  .where('mtg_requester', req.params.user)
		.andWhere('endtime', '<', now)
      .orWhere('students_string', 'like', '%' + req.params.user + '%')
		.andWhere('endtime', '<', now)
	  .orderBy('class_datetime', 'desc')

.then( sessions => {
	res.json({ sessions });
})
.catch (errors => res.status(500).json({ error: errors}));

});

export default router;

