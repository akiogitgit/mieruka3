import { Smoked } from "../../types/smoked"
export const calcSavingAmount = (
  registeredDurationDay: number,
  tabacoPrice: number,
  numTabacoPerDay: number,
  smokingCountAll: number,
) => {
  const savingAmount =
    (tabacoPrice * numTabacoPerDay * registeredDurationDay) / 19

  const spentAmount = (tabacoPrice * smokingCountAll) / 19
  console.log("節約金額", savingAmount)
  console.log("吸ってしまったタバコの金額", spentAmount)

  return savingAmount - spentAmount
}
