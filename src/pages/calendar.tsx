import React, { useCallback } from "react"
import { Layout } from "../components/Layout"
import { useEffect, useState } from "react"
import { Calendar } from "@mantine/dates"
import { NextPage } from "next"
import { useGetApi, useSelectEq } from "../hooks/useGetApi"
import { Center } from "@mantine/core"
import { useIsLoggedIn } from "../hooks/useIsLoggedIn"
import "dayjs/locale/ja"
import { useMediaQuery } from "@mantine/hooks"

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
        />
      </Center>
    </Layout>
  )
}

export default CalendarGraph
