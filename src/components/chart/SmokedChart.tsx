import React, { FC, useCallback, useRef } from "react"
import { useEffect, useState } from "react"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts"
import { Smoked } from "../../types/smoked"
import { supabase } from "../../utils/supabase"
import useStore from "../../store"
import { options } from "./options"

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
// 禁煙カレンダー（吸った日、禁断症状出た日）
export const SmokedChart: FC<Props> = ({ userName }) => {
  const session = useStore(s => s.session)
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

    for (const smokingDetail of smokedData) {
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
          smokingCountPerDay.push([saveSmokingTimestamp, smokingCount])
        }
        smokingCount = 0
        saveSmokingTimestamp = smokingTimeStamp
      }
    }

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
          name: "吸った本数",
          tooltip: {
            valueSuffix: "本",
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
        text: `${userName ?? "ゲスト"}さんのタバコを吸った本数`,
      },
    }
    setChartOptions(newOptions)
    console.log("setoptions", options)
  }, [session?.user?.id, userName])

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
