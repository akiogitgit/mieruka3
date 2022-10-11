import React, { useCallback, useRef } from "react"
import { Layout } from "../components/Layout"
import { useEffect, useState } from "react"
import { Calendar } from "@mantine/dates"
import { NextPage } from "next"
import { useGetApi } from "../hooks/useGetApi"
import { Center } from "@mantine/core"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts"
import { calcLifespan } from "../components/profile/lifespan"
import { calcSavingAmount } from "../components/profile/savingMoney"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import { Smoked } from "../types/smoked"
import { supabase } from "../utils/supabase"

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

const options = {
  series: [
    {
      data: [[0, 0]],
      shadow: true,
      color: "#2BAEF0",
    },
  ],
  title: {
    text: "日毎の統計",
  },
  subtitle: {
    text: "Chart with datetime axis",
  },
  xAxis: {
    title: {
      text: "日付",
    },
    type: "datetime",
    // minPadding: 0.1,
    // maxPadding: 0,
    // showLastLabel: true,
  },
  yAxis: {
    title: {
      text: "吸った本数",
    },
    opposite: true,
    offset: 0,
  },
  exporting: {
    enabled: true,
  },
  plotOptions: {
    series: {
      animation: false,
    },
    area: {
      fillColor: false,
      lineWidth: 2,
      threshold: null,
    },
  },
  scrollbar: {
    enabled: true,
  },
  navigator: {
    enabled: false,
  },
  rangeSelector: {
    enabled: false,
  },
  legend: {
    enabled: false,
  },
}

// カレンダー（吸った日、禁断症状出た日）
const CalendarGraph: NextPage = () => {
  const session = useIsLoggedIn()
  const chartComponent = useRef(null)
  const [smokedPerDay, setSmokedPerDay] = useState<number[][]>()

  const [chartOptions, setChartOptions] = useState(options)

  const [nonSmokingDuration, setNonSmokingDuration] = useState(0)
  const [savingPrice, setSavingPrice] = useState(0)
  const [lifespanStr, setLifespanStr] = useState("")

  // ログインしていたら、継続禁煙時間などをセット
  const setStatistics = useCallback(async () => {
    const userId = session?.user?.id
    console.log("userId", userId)
    if (userId === undefined || userId === null) {
      return
    }
    const smokedData = await getSmokedCreatedAt(userId)
    console.table(smokedData)
    if (
      smokedData === undefined ||
      smokedData === null ||
      smokedData?.length === 0
    ) {
      return
    }
    let smokingCountPerDay: number[][] = []
    let smokingCount = 0
    let saveSmokingTimestamp = 0
    for (const smokingDetail of smokedData) {
      const smokingTimestamp = new Date(smokingDetail.created_at).getTime()
      if (saveSmokingTimestamp === smokingTimestamp) {
        smokingCount = smokingCount + (smokingDetail?.num_tabaco ?? 0)
      } else {
        smokingCount = smokingCount + (smokingDetail?.num_tabaco ?? 0)
        if (saveSmokingTimestamp !== 0) {
          smokingCountPerDay.push([saveSmokingTimestamp, smokingCount])
        }
        smokingCount = 0
        saveSmokingTimestamp = smokingTimestamp
      }
    }
    smokingCountPerDay.push([saveSmokingTimestamp, smokingCount])
    const newOptions = {
      ...options,
      series: [
        {
          data: smokingCountPerDay ?? [],
          shadow: true,
          color: "#2BAEF0",
        },
      ],
    }
    setChartOptions(newOptions)
    console.log("setoptions", options)
  }, [session])

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

export default CalendarGraph
