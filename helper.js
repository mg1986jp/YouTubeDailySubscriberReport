// 差分を計算し、符号とともに数値を返す
function calculateDifference(currentValue, previousValue) {
  var diff = currentValue - previousValue;
  var sign = diff === 0 ? "" : (diff > 0 ? "+" : "-");
  return { 
    sign: sign, 
    diff: Math.abs(diff)
     };
}