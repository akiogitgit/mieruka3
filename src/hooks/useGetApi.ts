import { useCallback } from "react"
import { useQuery } from "react-query"
import { supabase } from "../utils/supabase"

type Props = {
  order?: string
  ascending?: boolean
}

export const useGetApi = <Data = any>(
  tableName: string,
  { order = "created_at", ascending = true }: Props,
) => {
  const getData = useCallback(async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order(order, { ascending })

    if (error) {
      throw new Error(error.message)
    }
    return data
  }, [ascending, order, tableName])

  return useQuery<Data[]>({
    queryKey: [tableName],
    queryFn: getData,
  })
}
