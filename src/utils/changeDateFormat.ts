export const changeDateFormat = (beforeDate: string) => {
  const date = new Date(beforeDate)
  const formated = new Intl.DateTimeFormat("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date)
  return formated
}

export const returnYearMonthDay = (date: Date): string => {
  const formated = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date)
  return formated
}
