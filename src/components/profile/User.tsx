import { Avatar, Card, Center, Group, Indicator } from "@mantine/core"
import Image from "next/image"
import { FC, useCallback, useEffect, useState } from "react"
import chat from "../../pages/chat"

type Props = {
  userId: string
  userName: string
}

export const User: FC<Props> = ({ userId, userName }) => {
  const userAvatarNumber = useCallback((user_id: string): number => {
    return Number(String(user_id).split("-")[2])
  }, [])
  return (
    <div className='flex gap-3 items-center'>
      <Indicator
        inline
        label=''
        size={16}
        offset={7} // 内側に7
        color='green'
        position='bottom-end'
        withBorder // 外側の白
        processing
      >
        <Avatar
          size='lg'
          radius='xl'
          className='transform duration-300 hover:scale-105'
          src={`https://www.gravatar.com/avatar/${userAvatarNumber(
            userId ?? "",
          )}/?d=robohash`}
        />
      </Indicator>
      <div>
        <p>{userName}</p>
      </div>
    </div>
  )
}
