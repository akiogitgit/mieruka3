import { useCallback } from "react"
import { useQuery } from "react-query"
import { supabase } from "../utils/supabase"

type GetApi = {
  order?: string
  ascending?: boolean
  select?: string
}

type SelectEq = {
  select?: string
  column?: string
  value?: string
}

export const useGetApi = <Data = any>(
  tableName: string,
  { order = "created_at", ascending = true, select = "*" }: GetApi,
) => {
  const getData = useCallback(async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select(select)
      .order(order, { ascending })

    if (error) {
      throw new Error(error.message)
    }
    return data
  }, [ascending, order, select, tableName])

  return useQuery<Data[]>({
    queryKey: [tableName],
    queryFn: getData,
  })
}

export const useSelectEq = <Data = any>(
  tableName: string,
  { select = "*", column = "id", value = "" }: SelectEq,
) => {
  const getData = useCallback(async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select(select)
      .eq(column, value)

    if (error) {
      throw new Error(error.message)
    }
    return data
  }, [column, select, tableName, value])

  return useQuery<Data[]>({
    queryKey: [tableName + column + value],
    queryFn: getData,
  })
}
