export const calcLifespan = (
  registeredDurationDay: number,
  numTabacoPerDay: number,
  smokingCountAll: number,
) => {
  let lifespanSecond = ~~(registeredDurationDay * numTabacoPerDay * 330)
  lifespanSecond = lifespanSecond - smokingCountAll * 330
  let lifespanMinute = ~~(lifespanSecond / 60)
  lifespanSecond = lifespanSecond - lifespanMinute * 60
  let lifespanHour = ~~(lifespanMinute / 60)
  lifespanMinute = lifespanMinute - lifespanHour * 60
  let lifespanDay = ~~(lifespanHour / 24)
  lifespanHour = lifespanHour - lifespanDay * 24

  return {
    lifespanSecond,
    lifespanMinute,
    lifespanHour,
    lifespanDay,
  }
}
