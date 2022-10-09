import React, { useCallback } from "react"
import { Layout } from "../components/Layout"
import { useEffect, useState } from "react"
import { Calendar } from "@mantine/dates"
import { NextPage } from "next"
import { useGetApi } from "../hooks/useGetApi"
import { Center } from "@mantine/core"

// カレンダー（吸った日、禁断症状出た日）
const CalendarGraph: NextPage = () => {
  const [value, setValue] = useState<Date[]>()
  const { data } = useGetApi<{ created_at: string }>("profiles", {
    select: "created_at",
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

  return (
    <Layout>
      <Center>
        <h1>カレンダー</h1>
      </Center>
      <Center>
        <Calendar multiple value={value} onChange={() => 0} size='xl' />
      </Center>
    </Layout>
  )
}

export default CalendarGraph
