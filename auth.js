// OAuth2のサービスを設定する関数
function getService() {
  return OAuth2.createService('YouTube')
    .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setClientId(CLIENT_ID)
    .setClientSecret(CLIENT_SECRET)
    .setScope('https://www.googleapis.com/auth/youtube.readonly')
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setTokenHeaders({Authorization: 'Basic ' + Utilities.base64Encode(CLIENT_ID + ':' + CLIENT_SECRET)});
}

// 認証コールバック処理
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  
  if (authorized) {
    var refreshToken = service.getToken().refresh_token;
    if (refreshToken) {
      PropertiesService.getUserProperties().setProperty(REFRESH_TOKEN_KEY, refreshToken);
      Logger.log("リフレッシュトークンを保存しました");
    }
    Logger.log("認証成功");
  } else {
    Logger.log("認証失敗");
  }
  return HtmlService.createHtmlOutput("認証完了！");
}

// 無効なトークンの削除
function resetAuth() {
    var service = getService();
    service.reset();
    Logger.log("OAuth 認証情報をリセットしました。");
}

// 認証のチェック
function checkAuth() {
  var service = getService();
  if (!service.hasAccess()) {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('認証が必要です: ' + authorizationUrl);
    return false;
  }
  Logger.log('すでに認証済み');
  return true;
}

// アクセストークン取得（半永続化対応）
function getAccessToken() {
  var service = getService();

  // すでに認証済みならトークンを取得
  if (service.hasAccess()) {
    return service.getAccessToken();
  }

  // 認証が切れている場合はリフレッシュトークンを使って再取得
  var refreshToken = PropertiesService.getUserProperties().getProperty(REFRESH_TOKEN_KEY);
  if (refreshToken) {
    Logger.log("リフレッシュトークンを使用してアクセストークンを更新します");
    
    var tokenResponse = UrlFetchApp.fetch('https://accounts.google.com/o/oauth2/token', {
      method: 'post',
      payload: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      },
      muteHttpExceptions: true
    });

    var tokenData = JSON.parse(tokenResponse.getContentText());
    if (tokenData.access_token) {
      service.getToken().access_token = tokenData.access_token;
      Logger.log("アクセストークンを更新しました");
      return tokenData.access_token;
    } else {
      Logger.log("アクセストークンの更新に失敗しました。再認証が必要です。");
      return null;
    }
  }

  Logger.log("認証情報が不足しているため、再認証が必要です。");
  return null;
}