window.twittler = {};

var updateTweets = function() {
  $('.allTweets').text('');
  var index = streams.home.length - 1;
  while(index >= 0){
    var tweet = streams.home[index];
    var $tweet = $('<div class="tweet"></div>');
    $tweet.html('@' + tweet.user + ': ' + tweet.message + '<br>' + tweet.created_at);
    $tweet.appendTo($('.allTweets'));
    index -= 1;
  }
};
