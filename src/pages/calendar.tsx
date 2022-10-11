import React, { useCallback } from "react"
import { Layout } from "../components/Layout"
import { useEffect, useState } from "react"
import { Calendar } from "@mantine/dates"
import { NextPage } from "next"
import { useGetApi, useSelectEq } from "../hooks/useGetApi"
import { Center, Indicator } from "@mantine/core"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import "dayjs/locale/ja"
import { useMediaQuery } from "@mantine/hooks"
import { returnYearMonthDay } from "../utils/changeDateFormat"

// カレンダー（吸った日、禁断症状出た日）
const CalendarGraph: NextPage = () => {
  const session = useIsLoggedIn()
  const [value, setValue] = useState<Date[]>()
  const { data } = useSelectEq<{ created_at: string }>("smoked", {
    select: "created_at",
    column: "user_id",
    value: session?.user?.id,
  })

  const getDates = useCallback(() => {
    const dates = data?.map(item => {
      return new Date(item.created_at)
    })
    setValue(dates)
  }, [data])

  useEffect(() => {
    getDates()
  }, [getDates])

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
            const smokedDates = value.map(v => returnYearMonthDay(v))
            const isSmoked = smokedDates.includes(formatedDate)
            return (
              <Indicator
                label={"4"} // 吸った本数
                size={16}
                color='red'
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
