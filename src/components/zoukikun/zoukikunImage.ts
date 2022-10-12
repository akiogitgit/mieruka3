export const zokikunImage = (continuousNonSmokingDuration: number): string => {
  const minutes = continuousNonSmokingDuration / 60
  const hours = minutes / 60

  if (minutes < 20 || !continuousNonSmokingDuration) {
    return "/zouki/hai_very_bad.png"
  }
  if (minutes > 20 && hours < 2) {
    return "/zouki/kanzo.png"
  }
  if (hours > 2 && hours < 6) {
    return "/zouki/hai_bad.png"
  }
  if (hours > 6 && hours < 8) {
    return "/zouki/kanzo_bad.png"
  }
  if (hours > 8 && hours < 12) {
    return "/zouki/hai_good.png"
  }
  return "/zouki/kanzo_good.png"
}
