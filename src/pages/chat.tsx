import { Avatar, Badge, Button, Indicator, Paper, Modal } from "@mantine/core"
import React, { useCallback, useEffect, useState } from "react"
import { ChatCreateButton } from "../components/ChatCreateButton"
import { Layout } from "../components/Layout"
import { Chat } from "../types/chat"
import { supabase } from "../utils/supabase"

// 全体チャットページ
const Chat = () => {
  const [chats, setChats] = useState<Chat[]>([])

  const getChats = useCallback(async () => {
    const { data, error, status } = await supabase
      .from<Chat>("chats")
      .select("*")
    if (error) {
      throw error
    }
    if (data) {
      setChats(data)
    }
  }, [])

  useEffect(() => {
    getChats()
    const chatsListener = supabase
      .from("chats")
      .on("*", payload => {
        getChats()
        console.log("subscribe")
      })
      .subscribe()
    console.log(chats)
    return () => {
      chatsListener.unsubscribe()
    }
  }, [])

  return (
    <Layout>
      <div className='flex justify-between'>
        <h1>タイムライン</h1>
        <ChatCreateButton />
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
