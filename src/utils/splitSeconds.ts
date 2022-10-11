export const calcSplitTime = (second: number) => {
  let minute = ~~(second / 60)
  second = second - minute * 60
  let hour = ~~(minute / 60)
  minute = minute - hour * 60
  let day = ~~(hour / 24)
  hour = hour - day * 24

  return {
    second,
    minute,
    hour,
    day,
  }
}
