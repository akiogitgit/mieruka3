import React from "react"
import { Layout } from "../components/Layout"
import { useEffect, useState } from "react"
import { Calendar } from "@mantine/dates"
import { NextPage } from "next"
import { useGetApi } from "../hooks/useGetApi"

// カレンダー（吸った日、禁断症状出た日）
const CalendarGraph: NextPage = () => {
  const { data } = useGetApi("profiles", { select: "created_at" })
  //const data = query.data

  console.log(data)

  const now = new Date()
  //const date = new Date('2022-10-09T02:38:33.259262+00:00')
  const [value, setValue] = useState<Date[]>()

  const datelist =
    data?.map(item => {
      const date = new Date(item?.created_at)
      // return new Date(
      //   `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      // )
      return date
    }) ?? (() => [new Date()])

  useEffect(() => {
    // 最新のSessionで更新

    setValue(datelist)
  }, [])

  console.log("value:", value)
  console.log("datelist:", datelist)

  return (
    <Layout>
      <div>
        <h1>カレンダー</h1>
        <Calendar multiple value={value} onChange={setValue} size='md' />
      </div>
    </Layout>
  )
}

export default CalendarGraph
