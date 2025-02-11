// 処理実行日を起点に、２日前（終了期間）と３日前（開始期間）の日付を取得
function getYesterdayDates() {
  var today = new Date();
  var endDate = new Date(today.setDate(today.getDate() - 2)).toISOString().split('T')[0];
  var startDate = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
  return { startDate, endDate };
}

// 処理実行日を起点に、３日前（終了期間）と４日前（開始期間）の日付を取得
function getPrevDates() {
  var today = new Date();
  var endDate = new Date(today.setDate(today.getDate() - 3)).toISOString().split('T')[0];
  var startDate = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
  return { startDate, endDate };
}