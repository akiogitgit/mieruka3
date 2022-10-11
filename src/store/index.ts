import create from "zustand"
import { Session } from "@supabase/supabase-js"
import { Profile } from "../types/user"

type State = {
  session: Session | null
  setSession: (payload: Session | null) => void
  userInfo: Profile | null
  setUserInfo: (payload: Profile | null) => void
  count: number
  setCount: (v: number) => void
}

// 呼び時は const session = useStore(s=>s.session)

const useStore = create<State>(set => ({
  session: null,
  setSession: payload => set({ session: payload }),
  userInfo: null,
  setUserInfo: payload => set({ userInfo: payload }),
  count: 0,
  setCount: v => set({ count: v }),
}))

export default useStore
