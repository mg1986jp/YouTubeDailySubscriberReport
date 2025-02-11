// YouTube Analytics API
function getAnalyticsData(startDate, endDate, dimensions, metrics) {

  var url = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${CHANNEL_ID}&startDate=${startDate}&endDate=${endDate}&metrics=${metrics}&dimensions=${dimensions}`;
  
  var options = {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + getAccessToken() },
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());

    if (json.error) {
      Logger.log('YouTube Analytics API エラー: ' + JSON.stringify(json.error));
      return {}
    }

    var analyticsData = (json.rows && json.rows.length > 0) ? {
      date: Utilities.formatDate(new Date(json.rows[0][0]), Session.getScriptTimeZone(), "yyyy年MM月dd日"),  // 日付
      views: json.rows[0][1],  // 視聴回数
      estimatedMinutesWatched: json.rows[0][2],  // 視聴された推定時間（分）
      likes: json.rows[0][3],  // いいねの数
      dislikes: json.rows[0][4],  // 低評価の数
      comments: json.rows[0][5],  // コメント数
      subscribersGained: json.rows[0][6],  // 登録者数の増加
      subscribersLost: json.rows[0][7]  // 登録者数の減少
    } : {};  // json.rowsが空なら空のオブジェクトを返す

    console.log(analyticsData);

    return analyticsData;
  } catch (e) {
    Logger.log('API取得エラー: ' + e.message);
    return {};
  }
}
