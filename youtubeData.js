// YouTube Data API
function getChannel(channelId) {
  var url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}`;
  var options = {
    method: 'get',
    headers: {
      'Authorization': 'Bearer ' + getAccessToken(),
    },
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());
  var channel = json.items[0];

  var channelInfo = {
    title: channel.snippet.title,
    description: channel.snippet.description,
    publishedAt: Utilities.formatDate(new Date(channel.snippet.publishedAt), Session.getScriptTimeZone(), "yyyy年MM月dd日"),
    viewCount: channel.statistics.viewCount,
    subscriberCount: channel.statistics.subscriberCount,
    videoCount: channel.statistics.videoCount
  };

  console.log(channelInfo);

  return channelInfo;
}

