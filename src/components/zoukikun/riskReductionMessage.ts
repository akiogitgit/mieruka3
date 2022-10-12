// 禁煙継続日数を受け取り、その経過時間毎にリスクの低下を返す
// 引数：1.2 -> 返り値："心臓の病気になる確率が下がりました"

export const riskReductionMessage = (
  continuousNonSmokingDuration: number,
): string => {
  const minutes = continuousNonSmokingDuration / 60
  const hours = minutes / 60
  const day = hours / 24
  const year = day / 365

  if (minutes < 20 || !continuousNonSmokingDuration) {
    return "禁煙がんばれ！"
  }
  if (minutes > 20 && hours < 2) {
    return "血圧が正常になってきたよ！"
  }
  if (hours > 2 && hours < 6) {
    return "血液中のニコチンの濃度が減ってきたよ！"
  }
  if (hours > 6 && hours < 8) {
    return "今が踏ん張り時！！がんばれ！"
  }
  if (hours > 8 && hours < 12) {
    return "血液中の酸素濃度が増えてきたよ！"
  }
  if (hours > 12 && hours < 24) {
    return "血液中の一酸化炭素が正常になってきたよ！"
  }
  if (day > 1 && day < 2) {
    return "心臓の病気になる確率が下がったよ！"
  }
  if (day > 2 && day < 3) {
    return "味覚、嗅覚が戻り始めてきたよ！ここが正念場！"
  }
  if (day > 3 && day < 7) {
    return "ニコチンが体からほぼ消えたよ！"
  }
  if (day > 7 && day < 14) {
    return "肺の中の淡が体から出てくるよ！"
  }
  if (day > 14 && day < 30) {
    return "心機能、循環機能が回復したよ！肌もすべすべに！"
  }
  if (day > 30 && day < 270) {
    if (day > 90 && day < 120) {
      return "肺機能が約30%良くなったよ！"
    }
    return "風邪などに感染しにくくなったよ！"
  }
  if (day > 270 && year < 5) {
    return "冠動脈疾患のリスクが半滅したよ！"
  }
  if (year > 5 && year < 7) {
    return "肺がんになるリスクが半滅したよ！"
  }
  if (year > 7 && year < 10) {
    return "白内障のリスクが非喫煙者と同じになったよ！"
  }
  if (year > 10 && year < 15) {
    return "肺がん、咽頭がんなどのリスクが60%低下したよ！"
  }
  if (year > 15 && year < 20) {
    return "冠動脈疾患のリスクが非喫煙と同じになったよ！"
  }

  return "口腔がんのリスクが非喫煙と同じになったよ！"
}
