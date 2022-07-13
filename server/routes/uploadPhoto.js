import express from 'express';

var knex = require('../db.js');

let router = express.Router();
const multer = require('multer');
const path = require('path');
var fs = require('fs-extra'); 
// configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/app/img/userPhotos');
  },
  filename: (req, file, cb) => {
    // The file name will be available as
    // req.file.pathname in the router handler.
    const newFilename = req.body.user + '.jpg';
    cb(null, newFilename);
  },
});
const upload = multer({ storage });
router.post('/', upload.single('selectedPhotoFile'), (req, res) => {
  console.log("New photo uploaded for", req.body.user, "and named", req.file.filename, ".");
  knex('person')
	  .where('username', req.body.user)
	  .update({
			photo: req.file.filename
		})
	  .then(msg => res.json({success: true, msg: msg }))
	  .catch (errors => res.status(500).json({ error: errors}));
});

router.get('/:user', (req, res) => {
	console.log("Sending file; req.params: ", req.params);
	const photoFile = req.params.user + ".jpg";
	const selfIntroFile = req.params.user = ".txt";
	const pathToFile = __dirname + '/../../src/app/img/userPhotos/' + photoFile;
	res.setHeader('Content-disposition', 'attachment; filename=' + photoFile);
	res.download(pathToFile, photoFile, function(error) {
	  if (!error) {
	    fs.unlink(pathToFile);
	  } else {
		  console.log("Error in file download to server: ", error);
		}
	});
});


export default router;
