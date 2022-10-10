import { Avatar, Card, Center, Group, Indicator, Text } from "@mantine/core"
import Image from "next/image"
import { FC, useCallback, useEffect, useState } from "react"
import chat from "../../pages/chat"

type Props = {
  userId: string
  userName: string | null
}

export const User: FC<Props> = ({ userId, userName }) => {
  const userAvatarNumber = useCallback((userId: string): number => {
    return Number(String(userId).split("-")[2])
  }, [])
  return (
    <div className='flex h-20 gap-3 items-center'>
      <Indicator
        inline
        label=''
        size={16}
        offset={7} // 内側に7
        color='green'
        position='bottom-end'
        withBorder // 外側の白
        processing
        ml={10}
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
        <Text>{userName ?? "ゲスト"}</Text>
      </div>
    </div>
  )
}
