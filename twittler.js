window.twittler = {};
twittler.view = 'home';
twittler.tweets = [];
twittler.container = {
  tweets: "#tweets",
  newTweets: "#new-tweets"
};
twittler.newTweetCount = 0;
twittler.intervalId = 0;

twittler.fetch = function(view) {
  if (!view || view === 'home') {
    this.tweets = streams.home;
  } else if (view.indexOf('#') > -1) {
    this.tweets = streams.hashtags[view];
  } else {
    this.tweets = streams.users[view];
  }

  return this;
};

twittler.display = function(tweets) {
  var $tweet;
  var message;

  tweets = this.tweets;

  $("#tweets").html(''); 

  for (var i = 0; i < tweets.length; i++) {
    $tweet = $('<div class="tweet"></div>');
    message = formatmsg(tweets[i].message);
    $tweet.append('<span class="username"> @' + tweets[i].user + '</span>: ' + '<span class="message">' + message+ '</span>' + '<span class="timestamp"> —' + $.timeago(tweets[i].created_at) + '</span>');
    $tweet.appendTo(this.container.tweets);
  }

  function formatmsg(msg) {
    var formattedmsg;
    var hashtagIndex;
    var hashtag;
    var begin;
    var end;

    hashtagIndex = msg.indexOf('#');

    if (hashtagIndex > -1) {
      begin = hashtagIndex;
      for (var i = hashtagIndex; i < msg.length; i++) {
        if (msg[i] === ' ') {
          end = i;
          break;
        }
      }
      formattedmsg = msg.slice(0, begin) + '<span class="hashtag">' + msg.slice(begin, end) + '</span>';
    }

    return formattedmsg || msg;
  }

  this.initEventHandlers();

  return this;
};
