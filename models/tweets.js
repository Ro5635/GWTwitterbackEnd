/**
 * Twitter tweet model
 *
 * I expect this will take quite a bit of refactoring to it...
 */
"use strict";

const Twitter = require('node-twitter');
const appKeys = require('../.appKeys');

const twitterSearchClient = new Twitter.SearchClient(
    appKeys[0], appKeys[1], appKeys[2], appKeys[3]
);
exports.getHashTag = function(searchHashTag){

    return new Promise(resolve => {

        twitterSearchClient.search({'q': searchHashTag}, function(error, result) {
            if (error)
            {
                console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
            }

            if (result)
            {
                resolve(result);
            }
        });

    });


};

