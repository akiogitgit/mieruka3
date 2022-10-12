import React, { useCallback } from "react"
import { Layout } from "../components/Layout"
import { useEffect, useState } from "react"
import { Calendar } from "@mantine/dates"
import { NextPage } from "next"
import { useGetApi, useSelectEq } from "../hooks/useGetApi"
import { Center, Indicator } from "@mantine/core"
import "dayjs/locale/ja"
import { useMediaQuery } from "@mantine/hooks"
import { returnYearMonthDay } from "../utils/changeDateFormat"

import useStore from "../store"

// カレンダー（吸った日、禁断症状出た日）
const CalendarGraph: NextPage = () => {
  const session = useStore(s => s.session)

  const [value, setValue] = useState<Date[]>()
  const [smokedData, setSmokedData] = useState<Date[]>()

  const { data } = useSelectEq<{ created_at: string; num_tabaco: number }>(
    "smoked",
    {
      select: "created_at, num_tabaco",
      column: "user_id",
      value: session?.user?.id,
    },
  )
  const { data: profileData } = useSelectEq("profiles", {
    select: "created_at",
    column: "user_id",
    value: session?.user?.id,
  })

  //console.log(data)
  // >"created_at"2022-10-10T14:50:46.177081+00:00"num_tabaco: 1"

  const getDates = useCallback(() => {
    setSmokedData(
      data?.map(item => {
        return new Date(item.created_at)
      }),
    )

    if (profileData === undefined || profileData?.length === 0) return
    const startDate = new Date(profileData[0]?.created_at)
    const endDate = new Date(Date.now())
    let dates = []
    for (
      let date = startDate;
      date < endDate;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(date)
    }
    setValue(dates)
  }, [profileData])

  useEffect(() => {
    getDates()
  }, [getDates])

  // 禁煙開始日時

  // レスポンシブ境界の定義
  const matches = useMediaQuery("(min-width:500px)")

  return (
    <Layout>
      <Center>
        <h1>カレンダー</h1>
      </Center>
      <Center>
        <Calendar
          locale='ja'
          multiple
          value={value}
          onChange={() => 0}
          size={matches ? "lg" : "sm"}
          labelFormat='YYYY/MM'
          renderDay={date => {
            const day = date.getDate()
            const formatedDate = returnYearMonthDay(date)

            if (!value) {
              return day
            }
            const smokedDates = smokedData?.map(v => returnYearMonthDay(v))
            console.log(smokedDates)
            /*0: "2022/10/10"
              1: "2022/10/11"
              2: "2022/10/11"
              3: "2022/10/11"
              4: "2022/10/11"*/
            const isSmoked = smokedDates?.includes(formatedDate)

            const smokesum = smokedDates?.filter(
              item => item === formatedDate,
            ).length
            // for (var i =0;i<smokedDates.length;i++){
            //   var elm = smokeDates[i];
            //   smokesum[elm]=(smokesum[elm]||0)+1
            // }

            return (
              <Indicator
                label={String(smokesum)} // 吸った本数,string
                size={16}
                color={"red"}
                offset={12}
                disabled={!isSmoked} // 日付
              >
                <div>{day}</div>
              </Indicator>
            )
          }}
        />
      </Center>
    </Layout>
  )
}

export default CalendarGraph
