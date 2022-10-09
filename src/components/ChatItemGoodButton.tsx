import React, { FC, useCallback } from "react"
import { Chat } from "../types/chat"
import { supabase } from "../utils/supabase"
type Props = {
  chat: Chat
}

// 実際にDBでUpdateしなくていい。
// useStateでコメントを押す数だけ増やすか、
// useStateのbooleanで押したらcss変える

export const ChatItemGoodButton: FC<Props> = ({ chat }) => {
  const updateNice = useCallback(async () => {
    const { error } = await supabase.from("chats").update({
      id: chat.id,
      created_at: chat.created_at,
      // user_id: chat.user_id,
      // user_name: chat.user_name,
      // message: chat.message,
      nice_count: chat.nice_count++,
    })
    if (error) {
      throw Error(error.message)
    }
  }, [chat.created_at, chat.id, chat.nice_count])

  const onClick = useCallback(async () => {
    console.log("click!", chat)
    await updateNice()
  }, [chat, updateNice])

  return <span onClick={onClick}>👍</span>
}
