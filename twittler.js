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

twittler.listen = function() {
  var self = this;
  var startlength = self.tweets.length;
  var intervalId;

  if (self.intervalId) {
    $(self.container.newTweets).text('');
    clearInterval(self.intervalId); 
  }

  self.intervalId = setInterval(listener, 300); 

  function listener() {
    if (self.tweets.length > startlength) {
      self.newTweetCount = self.tweets.length - startlength;
      updateNewTweetCount(self.newTweetCount);
    }
  }

  twittler.writeTweet = function(msg) {
  msg = $('#message').val();

  if (msg && msg !== '') {
    writeTweet(msg);
    $('#message').val(''); 
    this.fetch(this.view).display().listen(); 
  }
};

  function updateNewTweetCount(count) {
    $(self.container.newTweets).text(count + ' new tweets');
  }

};

twittler.initEventHandlers = function() {
  var self = this;


  $("input").unbind('keypress').keypress(function(e) { 
    if (e.which === 13) {
      e.preventDefault();
      self.writeTweet(); 
      return false;
    }
    return true;      
  });

  $(".username").click( function(e){
    e.preventDefault();
    var username = e.currentTarget.outerText.replace("@", "");

    self.view = username;
    self.fetch(username).display().listen();
    $('#viewall').css('display', 'inline-block'); 
  });

  $(".hashtag").click( function(e){
    e.preventDefault();
    var hashtag = e.currentTarget.outerText;
    self.view = hashtag;
    self.fetch(hashtag).display().listen();
    $('#viewall').css('display', 'inline-block'); 
  });

  $("#new-tweets").click( function(e){
    e.preventDefault();
    $('#new-tweets').text('');
    self.fetch(self.view).display().listen();
  });

  $('#viewall').click( function(e) {
    e.preventDefault();
    self.view = 'home';
    self.fetch(self.view).display().listen();
    $('#viewall').hide();
  });

};
