/**
 * Twitter tweet model
 *
 * I expect this will take quite a bit of refactoring to it...
 */
"use strict";

const Twitter = require('node-twitter');
const appKeys = require('../.appKeys');

const twitterSearchClient = new Twitter.SearchClient(
    appKeys.twitterAuth[0], appKeys.twitterAuth[1], appKeys.twitterAuth[2], appKeys.twitterAuth[3]
);

/**
 *
 * @param searchHashTag
 * @returns {Promise}
 */
exports.getHashTag = function(searchHashTag){

    return new Promise(resolve => {

        twitterSearchClient.search({'q': searchHashTag, 'count' : 100}, function(error, result) {
            if (error)
            {
                console.log('Error: ' + (error.code ? error.code + ' ' + error.message : error.message));
            }

            if (result)
            {

                let tweets = [];

                // Extract the meaningful information
                for(let tweetIndex = 0; tweetIndex < result.statuses.length; tweetIndex++){

                    // Get the current tweet
                    let currentTweet = result.statuses[tweetIndex];

                    let tweet = {};

                    // Get the general tweet data
                    tweet.id = currentTweet.id;
                    tweet.text = currentTweet.text;
                    tweet.lang = currentTweet.lang;
                    tweet.favoriteCount = currentTweet.favorite_count;
                    tweet.createdAt = currentTweet.created_at;
                    tweet.retweetCount = currentTweet.retweet_count;
                    tweet.userReTweeted = currentTweet.retweeted;

                    // Get the tweeters user data

                    let user = {};

                    user.id = currentTweet.user.id;
                    user.name = currentTweet.user.name;
                    user.screenName = currentTweet.user.screen_name;
                    user.description = currentTweet.user.description;
                    user.image = currentTweet.user.profile_image_url_https;
                    user.bgImage = currentTweet.user.profile_background_image_url_https;
                    user.bgColor = currentTweet.user.profile_sidebar_fill_color;
                    user.url = currentTweet.user.url;

                    tweet.user = user;

                    // Get the tweeted hashtags
                    tweet.hashtags = [];

                    for(let hashTagIndex = 0; hashTagIndex < currentTweet.entities.hashtags.length; hashTagIndex++){

                        let currentHashTagSource = currentTweet.entities.hashtags[hashTagIndex];

                        tweet.hashtags.push(currentHashTagSource.text);

                    }

                    // Get the user mentions
                    tweet.userMentions = [];

                    for(let userMentionsIndex = 0; userMentionsIndex < currentTweet.entities.user_mentions.length; userMentionsIndex++){

                        let currentUser = currentTweet.entities.user_mentions[userMentionsIndex];
                        let basicUserDetails = {};

                        basicUserDetails.id = currentUser.id;
                        basicUserDetails.name = currentUser.name;
                        basicUserDetails.screenName = currentUser.screen_name;

                        tweet.userMentions.push(basicUserDetails);

                    }

                    // Add the tweet to the tweets array
                    tweets.push(tweet);

                }

                let response = {};

                response.tweets = tweets;

                // Get the popular tags
                response.tags = getPopularTag(tweets);


                resolve(response);
            }
        });

    });


};

/**
 *
 * @param tweets
 * @returns {Array}
 */
function getPopularTag(tweets){

    let hashTags = {};
    let hashTagsArray = [];

    function tagsTracker(tag){

        tag = tag.toLowerCase();

        if(hashTags[tag]){
            // increment the count
            hashTags[tag] = hashTags[tag] + 1;

        }else{
            // Create the tag entry in data structure
            hashTags[tag] = 1;

        }


    }

    for(let tweetIndex in tweets){

        for(let tagIndex in tweets[tweetIndex].hashtags){
            tagsTracker(tweets[tweetIndex].hashtags[tagIndex]);

        }

    }

    // Reformat the data for ease of sort and later use
    for(let tag in hashTags){
        hashTagsArray.push({'tag' : tag, score : hashTags[tag]});

    }

    // Get the most common tag
    hashTagsArray.sort((a, b) => {
        if(a.score > b.score){
            return -1;

        }else if(a.score < b.score){
            return 1;

        }else{
            return 0;

        }

    });

    return hashTagsArray;


}

/**
 *
 * @param tweets
 */
function getPopularUsers(tweets){

    // So this is leading into the woods without a flashlight.

    // Loop through each of the tweets and get the number of times they have been re-tweeted and the popularity of the tags that they have
    // the existing functionality can be used to get the tag popularity information

}
