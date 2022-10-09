import React, { FC, useCallback, useState } from "react"
import { Chat } from "../types/chat"
import { FaRegThumbsUp } from "react-icons/fa"

type Props = {
  chat: Chat
}

export const ChatItemGoodButton: FC<Props> = ({ chat }) => {
  const [niceCount, setNiceCount] = useState(chat.nice_count)

  return (
    <span className='flex gap-1 items-center'>
      <FaRegThumbsUp
        className='cursor-pointer h-4 w-4 duration-75 hover:(h-5 w-5) '
        onClick={() => setNiceCount(niceCount + 1)}
      />
      <span>{niceCount}</span>
    </span>
  )
}
