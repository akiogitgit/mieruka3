import { Avatar, Badge, Button, Indicator, Paper } from "@mantine/core"
import React from "react"
import { Layout } from "../components/Layout"
import { useGetApi } from "../hooks/useGetApi"
import { Chat } from "../types/chat"
import { supabase } from "../utils/supabase"

// 全体チャットページ
const Chat = () => {
  const chats = [
    {
      id: "1",
      created_at: "10/3",
      user_id: "1",
      user_name: "志賀烈斗",
      message: "今日はもう吸ってやる！",
      nice_count: "-100",
    },
    {
      id: "2",
      created_at: "10/30",
      user_id: "11",
      user_name: "あきお",
      message: "今日は禁煙2日目！\nみんないいねよろしく",
      nice_count: "100",
    },
  ]

  const { data } = useGetApi<Chat>("profiles", {})
  console.log(data)

  return (
    <Layout>
      <div className='flex justify-between'>
        <h1>タイムライン</h1>
        <Button>投稿する</Button>
      </div>

      <div className='flex flex-col mt-4 gap-6'>
        {chats?.map(chat => (
          <div key={chat.id} className='flex gap-3 items-start'>
            <Indicator
              inline
              label=''
              size={16}
              offset={7} // 内側に7
              color='green'
              position='bottom-end'
              withBorder // 外側の白
              processing // 主張激しくなる
            >
              <Avatar
                size='lg'
                radius='xl'
                className='transform duration-300 hover:scale-105'
                src='https://source.unsplash.com/random'
              />
            </Indicator>
            <div>
              <p>{chat.user_name}</p>
              <Paper shadow='sm' p='sm'>
                <div className='whitespace-pre-wrap'>{chat.message}</div>
                <div className='cursor-pointer mt-2 text-sm inline'>
                  <span className='text-lg'>👍</span>
                  {chat.nice_count}
                </div>
              </Paper>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Chat
