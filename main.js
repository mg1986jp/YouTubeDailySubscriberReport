// チャンネル情報等を取得してメールで送信する関数
function sendEmail() {

  var dates = getYesterdayDates();
  var startDate = dates.startDate;
  var endDate = dates.endDate;

  var startDateStr = Utilities.formatDate(new Date(startDate), Session.getScriptTimeZone(), "yyyy年MM月dd日")
  var endDateStr = Utilities.formatDate(new Date(endDate), Session.getScriptTimeZone(), "yyyy年MM月dd日")

  var dimensions = "day";
  var metrics = "views,estimatedMinutesWatched,likes,dislikes,comments,subscribersGained,subscribersLost";

  // レポート対象のデータ 
  var channel = getChannel();  
  var analyticsData = getAnalyticsData(startDate, endDate, dimensions, metrics);

  // レポート対象の前日データ（対比用） 
  var prevDates = getPrevDates();
  var prevStartDate = prevDates.startDate;
  var prevEndDate = prevDates.endDate;
  var prevAnalyticsData = getAnalyticsData(prevStartDate, prevEndDate, dimensions, metrics);

  // 前日比の計算
  var viewsDiff = calculateDifference(analyticsData.views, prevAnalyticsData.views);
  var estimatedMinutesWatchedDiff = calculateDifference(analyticsData.estimatedMinutesWatched, prevAnalyticsData.estimatedMinutesWatched);
  var likesDiff = calculateDifference(analyticsData.likes, prevAnalyticsData.likes);
  var dislikesDiff = calculateDifference(analyticsData.dislikes, prevAnalyticsData.dislikes);
  var commentsDiff = calculateDifference(analyticsData.comments, prevAnalyticsData.comments);
  var subscribersGainedDiff = calculateDifference(analyticsData.subscribersGained, prevAnalyticsData.subscribersGained);
  var subscribersLostDiff = calculateDifference(analyticsData.subscribersLost, prevAnalyticsData.subscribersLost);


  var emailBody = `
    <h2>チャンネル統計！！！</h2>
    <p><strong>チャンネル名：</strong> ${channel.title}</p>
    <p><strong>チャンネル開設日：</strong> ${channel.publishedAt}</p>
    <p><strong>チャンネル登録者数：</strong> ${Number(channel.subscriberCount).toLocaleString()}人</p>
    <p><strong>ビデオ本数：</strong> ${Number(channel.videoCount).toLocaleString()}本</p>
    <p><strong>チャンネルの視聴回数：</strong> ${Number(channel.viewCount).toLocaleString()}回</p>
    <hr>
    <h2>アナリティクスおよび前日比</h2>
    <p><strong>対象期間：</strong> ${startDateStr} ~ ${endDateStr}</p>
    <p><strong>視聴回数：</strong> ${analyticsData.views}回 
      <span style="color:${viewsDiff.diff < 0 ? 'red' : (viewsDiff.diff > 0 ? 'blue' : 'inherit')}">${viewsDiff.sign} (${viewsDiff.diff.toLocaleString()})</span>
    </p>
    <p><strong>視聴された推定時間：</strong> ${analyticsData.estimatedMinutesWatched}分 
      <span style="color:${estimatedMinutesWatchedDiff.diff < 0 ? 'red' : (estimatedMinutesWatchedDiff.diff > 0 ? 'blue' : 'inherit')}">${estimatedMinutesWatchedDiff.sign} (${estimatedMinutesWatchedDiff.diff.toLocaleString()})</span>
    </p>
    <p><strong>高評価数：</strong> ${analyticsData.likes}件 
      <span style="color:${likesDiff.diff < 0 ? 'red' : (likesDiff.diff > 0 ? 'blue' : 'inherit')}">${likesDiff.sign} (${likesDiff.diff.toLocaleString()})</span>
    </p>
    <p><strong>低評価数：</strong> ${analyticsData.dislikes}件 
      <span style="color:${dislikesDiff.diff < 0 ? 'red' : (dislikesDiff.diff > 0 ? 'blue' : 'inherit')}">${dislikesDiff.sign} (${dislikesDiff.diff.toLocaleString()})</span>
    </p>
    <p><strong>コメント数：</strong> ${analyticsData.comments}件 
      <span style="color:${commentsDiff.diff < 0 ? 'red' : (commentsDiff.diff > 0 ? 'blue' : 'inherit')}">${commentsDiff.sign} (${commentsDiff.diff.toLocaleString()})</span>
    </p>
    <p><strong>登録者数の増加：</strong> ${analyticsData.subscribersGained}人 
      <span style="color:${subscribersGainedDiff.diff < 0 ? 'red' : (subscribersGainedDiff.diff > 0 ? 'blue' : 'inherit')}">${subscribersGainedDiff.sign} (${subscribersGainedDiff.diff.toLocaleString()})</span>
    </p>
    <p><strong>登録者数の減少：</strong> ${analyticsData.subscribersLost}人 
      <span style="color:${subscribersLostDiff.diff < 0 ? 'red' : (subscribersLostDiff.diff > 0 ? 'blue' : 'inherit')}">${subscribersLostDiff.sign} (${subscribersLostDiff.diff.toLocaleString()})</span>
    </p>

  `;

  MailApp.sendEmail({
    to: MAIL_TO,
    subject: `【${channel.title}】 YouTubeレポート`,
    htmlBody: emailBody,
    name: channel.title
  });
}
