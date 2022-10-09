import React from "react"
import { useState } from "react"
import { Layout } from "../components/Layout"

import {
  Button,
  Indicator,
  Avatar,
  Paper,
  Textarea,
  Stack,
} from "@mantine/core"
import { useForm } from "@mantine/form"

// setMessages([...messages, newMssege])

const DirectMessage = () => {
  const [directMessages, setDirectMessages] = useState([
    {
      id: 1,
      user_name: "Doctor",
      message: "何かあったらメッセージをください",
    },
  ])

  const form = useForm<{ text: string }>({
    initialValues: {
      text: "",
    },
    validate: {
      text: (v: string) => (v === "" ? "メッセージを入力してください" : null),
    },
  })

  const onSubmit = () => {
    setDirectMessages([
      ...directMessages,
      {
        id: 2,
        user_name: "tabakoMan",
        message: form.values.text,
      },
    ])
    form.reset()
    console.log(directMessages)
  }
  return (
    <Layout>
      <div className='flex flex-col mt-4 gap-6'>
        {directMessages?.map(directMessage => (
          <div key={directMessage.id} className='flex gap-3 items-start'>
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
                src={`${
                  directMessage.user_name === "Doctor"
                    ? "/doctor.png"
                    : "/tabakoMan.png"
                }`}
              />
            </Indicator>
            <div>
              <p>{directMessage.user_name}</p>
              <Paper shadow='sm' p='sm'>
                <div className='whitespace-pre-wrap'>
                  {directMessage.message}
                </div>
                <div className='cursor-pointer mt-2 text-sm inline'></div>
              </Paper>
            </div>
          </div>
        ))}

        <Stack mt={20}>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Textarea
              placeholder='お医者さんへのメッセージを入力してください'
              // なくても良さそう↓
              label='お医者さんへのメッセージ'
              {...form.getInputProps("text")}
            />
            {/* {JSON.stringify(form.values)} */}
            <Button onClick={onSubmit}>投稿</Button>
          </form>
        </Stack>
      </div>
    </Layout>
  )
}
export default DirectMessage
