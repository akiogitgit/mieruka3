import { useCallback, useEffect } from "react"
import useStore from "../store"
import { Profile } from "../types/user"
import { supabase } from "../utils/supabase"

export const useGetSession = () => {
  const session = useStore(state => state.session)
  const setSession = useStore(state => state.setSession)
  const setUserInfo = useStore(state => state.setUserInfo)

  const getUserInfo = useCallback(async () => {
    const { data, error, status } = await supabase
      .from<Profile>("profiles")
      .select("*")
      .eq("user_id", session?.user?.id ?? "")
      .single()

    if (error && status !== 406) {
      throw error
    }
    if (data) {
      setUserInfo(data)
      console.log("info: ", data)
    }
  }, [session?.user?.id, setUserInfo])

  console.log("useGetSession")

  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])

  useEffect(() => {
    setSession(supabase.auth.session())
    // 最新のSessionで更新
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [setSession, session])
}
