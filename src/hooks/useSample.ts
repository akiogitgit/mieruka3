import { useCallback } from "react"

export const useSample = () => {
  const smaple = useCallback(() => {
    console.log("sample")
  }, [])

  return { smaple }
}
