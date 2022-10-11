import React, { FC, useCallback, useRef } from "react"
import { useEffect, useState } from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts"
import { Smoked } from "../../types/smoked"
import { supabase } from "../../utils/supabase"
import useStore from "../../store"
import { options } from "./options"
import { calcSavingAmount } from "../profileDetail/savingAmount"

async function getSmokedCreatedAt(userId: string) {
  const { data, error, status } = await supabase
    .from<Smoked>("smoked")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error && status !== 406) {
    // dataがなかった時はthrow errorしない
    throw new Error(error.message)
  }
  return data
}

function formedDateOfThisWeek() {
  const today = new Date()
  const thisYear = today.getFullYear()
  const thisMonth = today.getMonth()
  const date = today.getDate()
  const dayNum = today.getDay()
  const thisMonday = date - dayNum + 1
  const thisSunday = thisMonday + 6

  const startDate =
    new Date(thisYear, thisMonth, thisMonday).getTime() + 9 * 60 * 60 * 1000
  const endDate =
    new Date(thisYear, thisMonth, thisSunday).getTime() + 9 * 60 * 60 * 1000

  return { startDate, endDate }
}

type Props = {
  userName: string | null
}
// カレンダー（吸った日、禁断症状出た日）
export const SavingAmountChart: FC<Props> = ({ userName }) => {
  const session = useStore(s => s.session)
  const userInfo = useStore(s => s.userInfo)
  const chartComponent = useRef(null)
  const [chartOptions, setChartOptions] = useState(options)

  // ログインしていたら、継続禁煙時間などをセット
  const setStatistics = useCallback(async () => {
    const userId = session?.user?.id
    console.log("userId", userId)
    if (userId === undefined || userId === null) {
      return
    }
    const smokedData = (await getSmokedCreatedAt(userId)) ?? []
    console.table(smokedData)

    let smokingCountPerDay: number[][] = []
    let smokingCount = 0
    let saveSmokingTimestamp = 0

    const tabacoPrice = userInfo?.tabaco_price ?? 0
    const numTabacoPerDay = userInfo?.num_tabaco_per_day ?? 0
    const spendAmountPerDay = (tabacoPrice / 19) * numTabacoPerDay

    smokedData.forEach((smokingDetail, index) => {
      const smokingDate = new Date(
        smokingDetail.created_at,
      ).toLocaleDateString()

      console.log("smoking date", smokingDate)
      const smokingTimeStamp =
        new Date(smokingDate).getTime() + 9 * 60 * 60 * 1000 // 15時間消す(なんかうまく時間取れない。。。)

      if (saveSmokingTimestamp === smokingTimeStamp) {
        smokingCount = smokingCount + (smokingDetail?.num_tabaco ?? 0)
      } else {
        smokingCount = smokingCount + (smokingDetail?.num_tabaco ?? 0)
        if (saveSmokingTimestamp !== 0) {
          smokingCountPerDay.push([
            saveSmokingTimestamp,
            ~~((spendAmountPerDay * 3) / (index + 1)),
          ])
        }
        smokingCount = 0
        saveSmokingTimestamp = smokingTimeStamp
      }
    })

    smokingCountPerDay.push([saveSmokingTimestamp, smokingCount])
    // console.log("smokin2: ", smokingCountPerDay)
    const thisWeek = formedDateOfThisWeek()
    const newOptions = {
      ...options,
      series: [
        {
          data: smokingCountPerDay ?? [],
          shadow: true,
          color: "#2BAEF0",
          name: "節約できた金額",
          tooltip: {
            valueSuffix: "円",
          },
        },
      ],
      xAxis: {
        title: {
          text: "日付",
        },
        type: "datetime",
        minPadding: 0.1,
        maxPadding: 0,
        // showLastLabel: true,
        // tickInterval: 24 * 3600,
        labels: {
          format: "{value:%Y-%m-%d}",
        },
        min: thisWeek.startDate,
        max: thisWeek.endDate,
      },
      title: {
        text: `${userName ?? "ゲスト"}さんの節約できた金額`,
      },
    }
    setChartOptions(newOptions)
    console.log("setoptions", options)
  }, [
    session?.user?.id,
    userInfo?.num_tabaco_per_day,
    userInfo?.tabaco_price,
    userName,
  ])

  useEffect(() => {
    setStatistics()
  }, [setStatistics])

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartComponent}
        options={chartOptions}
      />
    </div>
  )
}
