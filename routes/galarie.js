const express = require('express');
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const router = express.Router();


// Load Galarie Model

require('../models/galarie');

const Galarie = mongoose.model('galarie');



const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./uploads");
    },
    filename: function(req, file, callback) {
      callback(null, file.originalname);
    }
  }),

  fileFilter: function(req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".PNG" &&
      ext !== ".JPG" &&
      ext !== ".GIF" &&
      ext !== ".JPEG"
    ) {
      return callback(/*res.end('Only images are allowed')*/ null, false);
    }
    callback(null, true);
  }
});

// Galarie Index Page
router.get('/', (req, res) => {
  Galarie.find()
    .sort({date:'desc'})
    .then(galaries => {
      res.render('index', {
        galaries: galaries
        
      });
      
      
    });
});

// Add Galarie Form
router.get('/add', (req, res) => {
  res.render('index');
});

// Edit Galarie Form
router.get('/edit/:id', (req, res) => {
  Galarie.findOne({
    _id: req.params.id
  })
  .then(galarie => {

      res.render('index', {
        galarie:galarie
      });
    
  });
});

// Process Form
router.post("/", upload.any(), (req, res) => {
  
  const newUpload = {
    type: req.body.type,
    keyword: req.body.keyword,
    image: req.files[0].filename
  };
  new Galarie(newUpload).save().then(galarie => {
    res.redirect("/");
  });
});

// Edit Form process
router.put('/:id', (req, res) => {
  Galarie.findOne({
    _id: req.params.id
  })
  .then(galarie => {

    galarie.title = req.body.title;
    galarie.details = req.body.details;

    galarie.save()
      .then(galarie => {
        res.redirect('/');
      })
  });
});

// Delete Galarie
router.delete('/:id', (req, res) => {
  Galarie.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/');
    });
});

module.exports = router;