import { Session } from "@supabase/supabase-js"
import React, { useEffect, useState } from "react"
import { supabase } from "../utils/supabase"

export const useIsLoggedIn = () => {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    setSession(supabase.auth.session())
    // 最新のSessionで更新
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    console.log(session)
  }, [setSession, session])

  return session
}
