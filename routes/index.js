"use strict";
const express = require('express');
const router = express.Router();

// Custom models
const tweets = require('../models/tweets');

router.get('/', function(req, res, next) {

    const searchTag = req.query.searchtag;
    console.log(`Searching for ${searchTag}`);

    tweets.getHashTag(searchTag)
        .then( result => {

            res.send(result);

        }).catch( err => {

            console.log('oh eik!');
            console.log(err);

            res.send('There was some kind of issue');
    });

});

module.exports = router;
